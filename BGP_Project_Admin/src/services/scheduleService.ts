import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type {
  ScheduleResponse,
  ScheduleDetailResponse,
  SatpamOption,
  ShiftOption,
  PosOption,
  CreateJadwalBody,
  GenerateJadwalBody,
} from "../types/schedule";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const DAY_CODE = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

/**
 * Jadwal manual (assignment_uuid null) tidak punya "seri" resmi di BE —
 * endpoint /shift-instances TIDAK punya filter by pattern, jadi ditarik
 * per satpam+pos dulu (dengan `source: "manual"` supaya jadwal hasil
 * Assignment/rrule yang kebetulan sama satpam/pos TIDAK ikut kesenggol),
 * baru disaring ulang ke pattern yang sama di sisi FE. Dipakai bareng oleh
 * cancelManualSeriesFrom dan updateManualSeriesRange.
 */
async function findManualInstances({
  satpam_uuid,
  pos_uuid,
  pattern_uuid,
  from,
  to,
}: {
  satpam_uuid: string;
  pos_uuid: string;
  pattern_uuid: string;
  from: string;
  to?: string;
}): Promise<{ uuid: string; work_date: string }[]> {
  let cursor: string | null = null;
  const found: { uuid: string; work_date: string }[] = [];

  do {
    const params = new URLSearchParams({
      limit: "50",
      satpam: satpam_uuid,
      pos: pos_uuid,
      source: "manual",
      status: "scheduled",
      from,
    });
    if (to) params.append("to", to);
    if (cursor) params.append("cursor", cursor);

    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances?${params.toString()}`, {
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal memuat seri jadwal");

    for (const item of result.data ?? []) {
      if (item.pattern?.uuid === pattern_uuid) {
        found.push({ uuid: item.uuid, work_date: String(item.work_date).split("T")[0] });
      }
    }
    cursor = result.meta?.has_more ? result.meta.next_cursor : null;
  } while (cursor);

  return found;
}

/**
 * Jadwal AKTIF satpam ini di satu tanggal, pos/pattern apa pun — dipakai
 * updateManualSeriesRange buat mutuskan sebelum bikin instance baru di
 * hari tujuan geser: kalau di situ sudah ada persis shift yang sama
 * (pos+pattern sama), gak usah ditambahin lagi; kalau ada tapi beda,
 * biarkan create() coba jalan — BE sendiri yang menolak (409/422) kalau
 * jamnya bentrok, jadi overlap-nya tidak perlu dihitung ulang di sini.
 */
async function findActiveShiftsOnDate(
  satpam_uuid: string,
  date: string,
): Promise<{ pos_uuid: string; pattern_uuid: string }[]> {
  const params = new URLSearchParams({
    limit: "10",
    satpam: satpam_uuid,
    status: "scheduled",
    from: date,
    to: date,
  });
  const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances?${params.toString()}`, {
    headers: getHeaders(),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return (result.data ?? []).map((item: any) => ({
    pos_uuid: item.pos?.uuid,
    pattern_uuid: item.pattern?.uuid,
  }));
}

export const scheduleService = {
  getAll: async (
    limit: number = 50,
    cursor: string | null = null,
    from?: string,
    to?: string,
  ): Promise<ScheduleResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal memuat data jadwal");
    return res.json();
  },

  getById: async (uuid: string): Promise<ScheduleDetailResponse> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data jadwal");
    return res.json();
  },

  getOptions: async (): Promise<{
    satpam: SatpamOption[];
    shifts: ShiftOption[];
    pos: PosOption[];
  }> => {
    const headers = getHeaders();
    const [resSatpam, resShift, resPos] = await Promise.all([
      fetchWithAuth(`${BASE_URL_API}/satpam?limit=50`, { headers }),
      fetchWithAuth(`${BASE_URL_API}/shift-patterns?limit=50`, { headers }),
      fetchWithAuth(`${BASE_URL_API}/posts?type=utama&limit=50`, { headers }),
    ]);

    const dSatpam = await resSatpam.json();
    const dShift = await resShift.json();
    const dPos = await resPos.json();

    return {
      satpam: (dSatpam.data || []).map((s: any) => ({
        uuid: s.uuid,
        nama: s.nama,
        nip: s.nip,
      })),
      shifts: (dShift.data || []).map((s: any) => ({
        uuid: s.uuid,
        nama: s.nama,
        mulai: s.start_local,
        selesai: s.end_local,
      })),
      pos: (dPos.data || []).map((p: any) => ({ uuid: p.uuid, nama: p.nama })),
    };
  },

  create: async (body: CreateJadwalBody) => {
    const payload = {
      pattern_uuid: body.shift_uuid,
      pos_uuid: body.pos_uuid,
      satpam_uuid: body.satpam_uuid,
      work_date: body.tanggal,
    };
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menyimpan");
    return result;
  },

  /**
   * BE tidak punya endpoint PATCH untuk satu instance jadwal (Assignment
   * cuma bisa diubah rrule/tanggal efektifnya, bukan satpam/pos/pattern-nya
   * — lihat updateAssignmentSchema di shift.validation.mjs) — jadi "ubah"
   * diwujudkan sebagai kombinasi create + cancel. Kalau instance lama itu
   * bagian dari Assignment (rrule), cuma occurrence INI yang diganti —
   * assignment & occurrence lain di seri yang sama tidak disentuh.
   *
   * Urutannya beda tergantung apa satpamnya sama atau ganti:
   * - Satpam BEDA: aman create instance baru dulu baru batalkan yang lama
   *   (create gagal -> jadwal lama tetap utuh, gagal aman).
   * - Satpam SAMA: harus batalkan yang lama DULU baru bikin yang baru,
   *   karena BE menolak 2 jadwal aktif yang overlap buat satpam yang sama
   *   ("This satpam already has a shift covering that window") — create
   *   dulu di kasus ini malah selalu gagal ditolak BE. Kalau create gagal
   *   setelah cancel, dicoba pulihkan instance lama supaya satpam tidak
   *   sampai kehilangan jadwalnya sama sekali.
   */
  update: async (uuid: string, body: CreateJadwalBody) => {
    const old = await scheduleService.getById(uuid).catch(() => null);
    const sameSatpam = old?.data?.satpam?.uuid === body.satpam_uuid;

    if (!sameSatpam) {
      const created = await scheduleService.create(body);
      try {
        await scheduleService.delete(uuid);
      } catch (e: any) {
        throw new Error(
          `Jadwal baru berhasil dibuat, tapi jadwal lama gagal dibatalkan otomatis (${e.message || "error"}). Hapus manual jadwal lama supaya tidak dobel.`,
        );
      }
      return created;
    }

    await scheduleService.delete(uuid);
    try {
      return await scheduleService.create(body);
    } catch (createErr: any) {
      const reason = createErr.message || "error";
      if (!old?.data) throw createErr;

      let recovered = false;
      try {
        await scheduleService.create({
          satpam_uuid: old.data.satpam.uuid,
          pos_uuid: old.data.pos.uuid,
          shift_uuid: old.data.pattern.uuid,
          tanggal: String(old.data.work_date).split("T")[0],
        });
        recovered = true;
      } catch {
        recovered = false;
      }

      throw new Error(
        recovered
          ? `Gagal menyimpan perubahan (${reason}) — jadwal lama sudah dipulihkan lagi, tidak ada yang hilang.`
          : `Gagal menyimpan perubahan (${reason}), dan jadwal lama GAGAL dipulihkan. Satpam kehilangan jadwal tanggal ${String(old.data.work_date).split("T")[0]} — buat ulang manual segera.`,
      );
    }
  },

  /** Batalkan SATU jadwal (hari itu doang) — POST /shift-instances/:uuid/cancel. */
  delete: async (uuid: string) => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances/${uuid}/cancel`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menghapus");
    return result;
  },

  /**
   * Hapus pola berulang (Assignment) beserta seluruh jadwal ke depan yang
   * belum di-checkin — DELETE /shift-assignments/:uuid. BE sendiri yang
   * mengecualikan jadwal yang sudah ada catatan absensinya (riwayat tetap
   * aman), lihat shift.service.mjs deleteAssignment.
   */
  deleteAssignment: async (assignmentUuid: string) => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignmentUuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menghapus pola jadwal");
    return result;
  },

  getAssignment: async (
    uuid: string,
  ): Promise<{ rrule: string; effective_to: string | null }> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${uuid}`, {
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil pola jadwal");
    return result.data;
  },

  /**
   * "Hapus hari ini dan hari yang sama selanjutnya" untuk jadwal hasil
   * Assignment (rrule) — buang SATU hari (dayOfWeek) dari daftar BYDAY
   * rrule-nya lewat PATCH, tanpa mengganggu hari lain di pola yang sama.
   * Kalau itu satu-satunya hari di rrule, assignment-nya sekalian dihapus
   * (rrule kosong tidak berguna). Instance yang sudah kadung dibuat untuk
   * hari itu ke depan direkonsiliasi lewat /shift-instances/generate —
   * endpoint yang sama dipakai fitur "Generate Jadwal" — supaya efeknya
   * langsung kelihatan, bukan nunggu cron job jalan sendiri.
   */
  removeDayFromAssignment: async (assignmentUuid: string, dayOfWeek: number) => {
    const assignment = await scheduleService.getAssignment(assignmentUuid);
    const dayCode = DAY_CODE[dayOfWeek];
    const currentDays = (assignment.rrule.match(/BYDAY=([^;]+)/)?.[1] ?? "")
      .split(",")
      .filter(Boolean);
    const remainingDays = currentDays.filter((d) => d !== dayCode);

    if (remainingDays.length === 0) {
      return scheduleService.deleteAssignment(assignmentUuid);
    }

    const newRrule = assignment.rrule.replace(/BYDAY=[^;]+/, `BYDAY=${remainingDays.join(",")}`);
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignmentUuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ rrule: newRrule }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengubah pola jadwal");

    const today = new Date();
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const oneYearAhead = new Date(today);
    oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);

    // Rrule-nya sudah kepatch (yang penting untuk ke depannya), rekonsiliasi
    // ini cuma biar efeknya kelihatan SEKARANG juga tanpa nunggu cron —
    // kalau gagal, tidak menggagalkan seluruh operasi (pola sudah benar),
    // tapi dicatat di console supaya kegagalan tidak hilang tanpa jejak.
    try {
      const genRes = await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          from: fmt(today),
          to: assignment.effective_to ?? fmt(oneYearAhead),
        }),
      });
      if (!genRes.ok) {
        console.warn("removeDayFromAssignment: rekonsiliasi /shift-instances/generate gagal, status", genRes.status);
      }
    } catch (e) {
      console.warn("removeDayFromAssignment: rekonsiliasi /shift-instances/generate gagal", e);
    }

    return result;
  },

  /**
   * Batalkan jadwal manual milik kombinasi satpam+pos+pattern yang sama,
   * dari tanggal `from` dan seterusnya (tanpa batas akhir). `dayOfWeek`
   * opsional buat "hapus hari ini dan hari yang sama selanjutnya" — cuma
   * batalkan yang jatuh di hari itu, hari lain tidak disentuh.
   */
  cancelManualSeriesFrom: async ({
    satpam_uuid,
    pos_uuid,
    pattern_uuid,
    from,
    dayOfWeek,
  }: {
    satpam_uuid: string;
    pos_uuid: string;
    pattern_uuid: string;
    from: string;
    dayOfWeek?: number;
  }) => {
    let targets = await findManualInstances({ satpam_uuid, pos_uuid, pattern_uuid, from });
    if (dayOfWeek !== undefined) {
      targets = targets.filter(
        (t) => new Date(`${t.work_date}T00:00:00`).getDay() === dayOfWeek,
      );
    }
    for (const t of targets) {
      await scheduleService.delete(t.uuid);
    }
    return { cancelled: targets.length };
  },

  /**
   * Sinkronkan jadwal manual di rentang tanggal `from`..`to` supaya cuma
   * ADA di hari-hari yang dicentang di "Pilih Hari" (daysOfWeek kosong =
   * semua hari) — dipakai form Edit saat "Ubah s.d. Tanggal" diisi.
   * Diproses per TANGGAL (bukan cuma per instance yang ketemu), supaya
   * "geser" beneran bisa mindah ke hari yang tadinya kosong sama sekali
   * (mis. dari "cuma Selasa" ke "cuma Rabu"), bukan cuma bisa
   * membatalkan/mengubah instance yang SUDAH ada.
   *
   * Per tanggal di rentang ini:
   * - Ada instance lama & harinya TIDAK dicentang -> dibatalkan.
   * - Ada instance lama & harinya dicentang -> diupdate (skip kalau
   *   datanya sama persis, biar gak cancel+create sia-sia).
   * - TIDAK ada instance lama & harinya dicentang -> dicek dulu apa satpam
   *   ini udah punya jadwal PERSIS sama (pos+pattern sama) di tanggal itu
   *   (dari kombinasi lain) — kalau ya, tidak ditambahin lagi (hindari
   *   duplikat); kalau beda, tetap dicoba dibuat, dan kalau BE menolak
   *   karena jamnya bentrok sama shift lain di hari itu, tanggal ini
   *   dilewati (dihitung sebagai `skipped`) tanpa menghentikan sisanya.
   * - TIDAK ada instance lama & harinya TIDAK dicentang -> tidak diapa2in.
   */
  updateManualSeriesRange: async ({
    satpam_uuid,
    pos_uuid,
    pattern_uuid,
    from,
    to,
    daysOfWeek,
    newBody,
  }: {
    satpam_uuid: string;
    pos_uuid: string;
    pattern_uuid: string;
    from: string;
    to: string;
    daysOfWeek?: number[];
    newBody: Omit<CreateJadwalBody, "tanggal">;
  }) => {
    const found = await findManualInstances({ satpam_uuid, pos_uuid, pattern_uuid, from, to });
    const foundByDate = new Map(found.map((f) => [f.work_date, f.uuid]));
    const allowed =
      daysOfWeek && daysOfWeek.length > 0 && daysOfWeek.length < 7 ? new Set(daysOfWeek) : null;
    const dataChanged =
      newBody.satpam_uuid !== satpam_uuid ||
      newBody.pos_uuid !== pos_uuid ||
      newBody.shift_uuid !== pattern_uuid;

    // Wall-clock lokal (bukan toISOString, yang bisa geser tanggal kalau
    // timezone browser bukan UTC) — cukup buat baca day-of-week & format
    // ulang jadi "YYYY-MM-DD", bukan disimpan/dikirim sebagai instant.
    const isoDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    let updated = 0;
    let created = 0;
    let cancelled = 0;
    let skipped = 0;

    const cursor = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);
    while (cursor <= end) {
      const dateStr = isoDate(cursor);
      const isAllowed = !allowed || allowed.has(cursor.getDay());
      const existingUuid = foundByDate.get(dateStr);

      if (existingUuid) {
        if (!isAllowed) {
          await scheduleService.delete(existingUuid);
          cancelled++;
        } else if (dataChanged) {
          await scheduleService.update(existingUuid, { ...newBody, tanggal: dateStr });
          updated++;
        }
      } else if (isAllowed) {
        // Hari tujuan geser belum punya instance dari kombinasi ASLI — tapi
        // satpam ini bisa jadi udah punya jadwal LAIN (pos/pattern apa pun)
        // di tanggal ini. Kalau persis sama (pos+pattern sama), gak usah
        // ditambahin lagi (hindari duplikat). Kalau beda, tetap dicoba —
        // BE sendiri yang menolak (409/422) kalau jamnya bentrok; ditangkap
        // di sini supaya satu tanggal gagal tidak menghentikan sisanya.
        const activeOnDate = await findActiveShiftsOnDate(newBody.satpam_uuid, dateStr);
        const alreadyExact = activeOnDate.some(
          (a) => a.pos_uuid === newBody.pos_uuid && a.pattern_uuid === newBody.shift_uuid,
        );
        if (!alreadyExact) {
          try {
            await scheduleService.create({ ...newBody, tanggal: dateStr });
            created++;
          } catch {
            skipped++;
          }
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return { updated, created, cancelled, skipped };
  },

  generate: async (body: GenerateJadwalBody) => {
    const byday = body.days_of_week
      .map((d) => DAY_CODE[d])
      .filter(Boolean);
    const rrule = `FREQ=WEEKLY;BYDAY=${byday.join(",")}`;

    const assignmentRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        pattern_uuid: body.shift_uuid,
        pos_uuid: body.pos_uuid,
        satpam_uuid: body.satpam_uuid,
        rrule,
        effective_from: body.start_date,
        effective_to: body.end_date,
      }),
    });
    const assignmentResult = await assignmentRes.json().catch(() => ({}));
    if (!assignmentRes.ok)
      throw new Error(
        assignmentResult.error?.message ||
          assignmentResult.message ||
          "Gagal membuat jadwal rutin",
      );

    const generateRes = await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ from: body.start_date, to: body.end_date }),
    });
    const generateResult = await generateRes.json().catch(() => ({}));
    if (!generateRes.ok)
      throw new Error(
        generateResult.error?.message ||
          generateResult.message ||
          "Gagal generate jadwal",
      );

    return generateResult;
  },
};

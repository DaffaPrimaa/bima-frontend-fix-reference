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

  update: async (_uuid: string, _body: CreateJadwalBody) => {
    throw new Error(
      "Fitur ubah jadwal belum didukung oleh backend saat ini. Hapus lalu buat ulang jadwal.",
    );
  },

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

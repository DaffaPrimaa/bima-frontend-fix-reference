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
  Jadwal,
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

  getAssignmentById: async (uuid: string) => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data assignment");
    return res.json();
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

  update: async (item: Jadwal | any, body: CreateJadwalBody, mode: "single" | "future" = "single") => {
    const assignmentUuid = item.assignment_uuid || item.assignment?.uuid;
    if (assignmentUuid) {
      if (mode === "single") {
        const recurrenceId = item.recurrence_id || item.work_date;
        const payload: Record<string, string> = {
          assignment_uuid: assignmentUuid,
          recurrence_id: recurrenceId,
          type: "override",
          work_date: body.tanggal,
          pattern_uuid: body.shift_uuid,
        };
        const res = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 409 && result.error?.code === "EXCEPTION_EXISTS") {
            const exQuery = new URLSearchParams({ assignment: assignmentUuid });
            const exRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions?${exQuery}`, { headers: getHeaders() });
            const exData = await exRes.json().catch(() => ({ data: [] }));
            const existingEx = (exData.data || []).find((e: any) => e.recurrence_id === recurrenceId || e.recurrence_id?.startsWith(recurrenceId));
            if (existingEx) {
              await fetchWithAuth(`${BASE_URL_API}/shift-exceptions/${existingEx.uuid}`, { method: "DELETE", headers: getHeaders() });
              const retryRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(payload),
              });
              const retryResult = await retryRes.json().catch(() => ({}));
              if (!retryRes.ok) throw new Error(retryResult.error?.message || retryResult.message || "Gagal mengubah jadwal");
              await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ from: body.tanggal, to: body.tanggal }),
              }).catch(() => { });
              return retryResult;
            }
          }
          throw new Error(result.error?.message || result.message || "Gagal mengubah jadwal");
        }
        await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ from: body.tanggal, to: body.tanggal }),
        }).catch(() => { });
        return result;
      } else {
        const oldAssignmentRes = await scheduleService.getAssignmentById(assignmentUuid);
        const oldAssignment = oldAssignmentRes.data || oldAssignmentRes;
        const rrule = oldAssignment.rrule;

        const targetDate = new Date(body.tanggal);
        targetDate.setDate(targetDate.getDate() - 1);
        const effectiveTo = targetDate.toISOString().split("T")[0];

        await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignmentUuid}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ effective_to: effectiveTo }),
        });

        const payload = {
          pattern_uuid: body.shift_uuid,
          pos_uuid: body.pos_uuid,
          satpam_uuid: body.satpam_uuid,
          rrule: rrule,
          effective_from: body.tanggal,
        };

        const newAssignmentRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const result = await newAssignmentRes.json().catch(() => ({}));
        if (!newAssignmentRes.ok)
          throw new Error(result.error?.message || result.message || "Gagal membuat jadwal baru");

        const toDate = new Date(targetDate);
        toDate.setDate(toDate.getDate() + 32);
        await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ from: body.tanggal, to: toDate.toISOString().split("T")[0] }),
        });

        return result;
      }
    } else {
      await scheduleService.delete(item.uuid);
      return await scheduleService.create(body);
    }
  },

  delete: async (target: string | Jadwal | any, mode: "single" | "future" = "single") => {
    const assignmentUuid = typeof target === "object" ? (target.assignment_uuid || target.assignment?.uuid) : null;
    if (assignmentUuid) {
      if (mode === "single") {
        const recurrenceId = target.recurrence_id || target.work_date;
        const payload = {
          assignment_uuid: assignmentUuid,
          recurrence_id: recurrenceId,
          type: "cancel",
          reason: "admin",
        };
        const res = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 409 && result.error?.code === "EXCEPTION_EXISTS") {
            const exQuery = new URLSearchParams({ assignment: assignmentUuid });
            const exRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions?${exQuery}`, { headers: getHeaders() });
            const exData = await exRes.json().catch(() => ({ data: [] }));
            const existingEx = (exData.data || []).find((e: any) => e.recurrence_id === recurrenceId || e.recurrence_id?.startsWith(recurrenceId));
            if (existingEx) {
              await fetchWithAuth(`${BASE_URL_API}/shift-exceptions/${existingEx.uuid}`, { method: "DELETE", headers: getHeaders() });
              const retryRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(payload),
              });
              const retryResult = await retryRes.json().catch(() => ({}));
              if (!retryRes.ok) throw new Error(retryResult.error?.message || retryResult.message || "Gagal menghapus jadwal");
              return retryResult;
            }
          }
          throw new Error(result.error?.message || result.message || "Gagal menghapus jadwal");
        }
        return result;
      } else {
        const targetDateStr = target.recurrence_id || target.work_date;

        const assignmentRes = await scheduleService.getAssignmentById(assignmentUuid);
        const assignment = assignmentRes.data || assignmentRes;
        const effectiveFrom: string = assignment.effective_from;
        const satpamUuid: string = assignment.satpam_uuid || assignment.satpam?.uuid;
        const posUuid: string = assignment.pos_uuid || assignment.pos?.uuid;
        const patternUuid: string = assignment.pattern_uuid || assignment.pattern?.uuid;

        if (!effectiveFrom || effectiveFrom >= targetDateStr) {
          await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignmentUuid}`, {
            method: "DELETE",
            headers: getHeaders(),
          });
        } else {
          const dayBefore = new Date(targetDateStr);
          dayBefore.setDate(dayBefore.getDate() - 1);
          const effectiveTo = dayBefore.toISOString().split("T")[0];

          const patchRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignmentUuid}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ effective_to: effectiveTo }),
          });
          const patchResult = await patchRes.json().catch(() => ({}));
          if (!patchRes.ok)
            throw new Error(patchResult.error?.message || patchResult.message || "Gagal menutup jadwal");
        }

        if (satpamUuid) {
          const listRes = await fetchWithAuth(
            `${BASE_URL_API}/shift-assignments?satpam=${satpamUuid}&limit=50`,
            { headers: getHeaders() }
          );
          const listData = await listRes.json().catch(() => ({ data: [] }));
          // Penerus HARUS kombinasi yang sama persis (satpam + pos + pattern).
          // Kalau cuma disaring per satpam, hapus "ke depannya" pada satu
          // jadwal bisa ikut menghapus jadwal satpam itu di pos/shift lain
          // yang sama sekali tidak disentuh admin.
          const successors = (listData.data || []).filter((a: any) => {
            if (a.uuid === assignmentUuid) return false;
            if ((a.effective_from || "") < targetDateStr) return false;
            const aPos = a.pos_uuid || a.pos?.uuid;
            const aPattern = a.pattern_uuid || a.pattern?.uuid;
            return aPos === posUuid && aPattern === patternUuid;
          });
          for (const succ of successors) {
            await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${succ.uuid}`, {
              method: "DELETE",
              headers: getHeaders(),
            }).catch(() => {});
          }
        }

        const toDate = new Date(targetDateStr);
        toDate.setDate(toDate.getDate() + 32);
        await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ from: targetDateStr, to: toDate.toISOString().split("T")[0] }),
        }).catch(() => {});

        return { success: true };
      }
    }

    const uuid = typeof target === "string" ? target : target.uuid;
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

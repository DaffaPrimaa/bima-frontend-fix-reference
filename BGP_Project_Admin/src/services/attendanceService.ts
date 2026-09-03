import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type {
  AttendanceResponse,
  AttendanceDetailResponse,
  UpdateAttendancePayload,
} from "../types/attendance";
import { getToken } from "../Utils/helpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const attendanceService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    search?: string;
    status?: string;
    satpam?: string;
    client?: string;
    from?: string;
    to?: string;
  } = {}): Promise<AttendanceResponse> => {
    const limit = paramsObj.limit ?? 12;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.search) params.append("search", paramsObj.search);
    if (paramsObj.status) params.append("status", paramsObj.status);
    if (paramsObj.satpam) params.append("satpam", paramsObj.satpam);
    if (paramsObj.client) params.append("client", paramsObj.client);
    if (paramsObj.from) params.append("from", paramsObj.from);
    if (paramsObj.to) params.append("to", paramsObj.to);

    const res = await fetchWithAuth(`${BASE_URL}/attendance?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal memuat data absensi");
    return res.json();
  },

  getById: async (uuid: string): Promise<AttendanceDetailResponse> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil detail data");
    return res.json();
  },

  update: async (
    uuid: string,
    payload: UpdateAttendancePayload,
  ): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal update data");
  },

  export: async (): Promise<Blob> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/export`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengunduh file");
    return res.blob();
  },
};

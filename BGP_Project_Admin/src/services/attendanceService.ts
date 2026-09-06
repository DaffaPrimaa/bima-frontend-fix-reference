import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type {
  AttendanceResponse,
  UpdateAttendancePayload,
} from "../types/attendance";
import { getToken } from "../Utils/helpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const attendanceService = {
  getAll: async (
    limit: number = 20,
    cursor?: string | null,
    search?: string,
    status?: string,
    satpam?: string,
    client?: string,
    from?: string,
    to?: string
  ): Promise<AttendanceResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (satpam) params.append("satpam", satpam);
    if (client) params.append("client", client);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetchWithAuth(`${BASE_URL}/attendance?${params.toString()}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal memuat data absensi");
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: any }> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/${uuid}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
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
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Gagal update data");
    }
  },

  export: async (): Promise<Blob> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/export`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengunduh file");
    return res.blob();
  },

  exportById: async (uuid: string): Promise<Blob> => {
    const res = await fetchWithAuth(`${BASE_URL}/attendance/${uuid}/export`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengunduh file absensi");
    return res.blob();
  },
};

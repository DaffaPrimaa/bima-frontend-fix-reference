import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { Shift, ShiftResponse, CreateShiftPayload } from "../types/shift";
import { getToken } from "../Utils/helpers";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const toShift = (row: any): Shift => ({
  uuid: row.uuid,
  nama: row.nama,
  mulai: row.start_local,
  selesai: row.end_local,
  timezone: row.timezone,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const shiftService = {
  getAll: async (
    limit: number = 12,
    cursor: string | null = null,
    search: string = "",
  ): Promise<ShiftResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const res = await fetchWithAuth(`${BASE_URL_API}/shift-patterns?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data waktu");
    const result = await res.json();
    return { data: (result.data ?? []).map(toShift), meta: result.meta };
  },

  getById: async (uuid: string): Promise<{ data: Shift }> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-patterns/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil detail data");
    const result = await res.json();
    return { data: toShift(result.data) };
  },

  create: async (payload: CreateShiftPayload): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-patterns`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menyimpan");
  },

  update: async (uuid: string, payload: CreateShiftPayload): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-patterns/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengupdate");
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-patterns/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menghapus data");
  },
};

import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type {
  ShiftPatternResponse,
  ShiftPatternSingleResponse,
  CreateShiftPatternPayload,
  UpdateShiftPatternPayload,
} from "../types/shiftPattern";
import { getToken } from "../Utils/helpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const shiftPatternService = {
  getAll: async (
    limit: number = 20,
    cursor?: string | null,
    search?: string,
  ): Promise<ShiftPatternResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const res = await fetchWithAuth(
      `${BASE_URL}/shift-patterns?${params.toString()}`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error("Gagal memuat data shift pattern");
    return res.json();
  },

  getById: async (uuid: string): Promise<ShiftPatternSingleResponse> => {
    const res = await fetchWithAuth(`${BASE_URL}/shift-patterns/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil detail data shift pattern");
    return res.json();
  },

  create: async (payload: CreateShiftPatternPayload): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/shift-patterns`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal menambahkan shift pattern");
  },

  update: async (
    uuid: string,
    payload: UpdateShiftPatternPayload
  ): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/shift-patterns/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal update data shift pattern");
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/shift-patterns/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus shift pattern");
  },
};

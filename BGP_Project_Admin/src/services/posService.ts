import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { Pos, PosResponse, CreatePosPayload } from "../types/pos";
import { getToken } from "../Utils/helpers";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_API_URL}/posts`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const posService = {
  getAll: async (limit: number = 10, cursor: string | null = null, type: string = "jaga", search: string = ""): Promise<PosResponse> => {
    const params = new URLSearchParams({ type, limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const url = `${API_URL}?${params.toString()}`;
    const res = await fetchWithAuth(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal memuat data pos");
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: Pos }> => {
    const res = await fetchWithAuth(`${API_URL}/${uuid}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal memuat detail pos");
    return res.json();
  },

  create: async (payload: CreatePosPayload): Promise<void> => {
    const res = await fetchWithAuth(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal menyimpan data");
  },

  update: async (uuid: string, payload: CreatePosPayload): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal mengupdate data");
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/${uuid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal menghapus data");
  },
};

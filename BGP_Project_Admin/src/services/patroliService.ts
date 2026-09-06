import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { Patroli, PatroliResponse, UpdatePatroliPayload } from "../types/patroli";
import { getToken } from "../Utils/helpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const patroliService = {
  getAll: async (
    limit: number = 20, cursor?: string | null, search?: string, client?: string, status?: string): Promise<PatroliResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    if (client && client !== "all") params.append("client", client);
    if (status && status !== "all") params.append("status", status);

    const res = await fetchWithAuth(`${BASE_URL}/patrols?${params.toString()}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal memuat data patroli");
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: Patroli }> => {
    const res = await fetchWithAuth(`${BASE_URL}/patrols/${uuid}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengambil detail data patroli");
    return res.json();
  },

  update: async (
    uuid: string,
    payload: UpdatePatroliPayload,
  ): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/patrols/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Gagal update data");
  },

  export: async (): Promise<Blob> => {
    const res = await fetchWithAuth(`${BASE_URL}/patrols/export`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengunduh file");
    return res.blob();
  },

};

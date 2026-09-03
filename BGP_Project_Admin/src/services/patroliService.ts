import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { PatroliResponse, UpdatePatroliPayload } from "../types/patroli";
import { getToken } from "../Utils/helpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const patroliService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    search?: string;
    status?: string;
    satpam?: string;
    pos?: string;
    from?: string;
    to?: string;
  } = {}): Promise<PatroliResponse> => {
    const limit = paramsObj.limit ?? 12;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.search) params.append("search", paramsObj.search);
    if (paramsObj.status) params.append("status", paramsObj.status);
    if (paramsObj.satpam) params.append("satpam", paramsObj.satpam);
    if (paramsObj.pos) params.append("pos", paramsObj.pos);
    if (paramsObj.from) params.append("from", paramsObj.from);
    if (paramsObj.to) params.append("to", paramsObj.to);

    const res = await fetchWithAuth(`${BASE_URL}/patrols?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal memuat data patroli");
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
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal update data");
  },

  export: async (): Promise<Blob> => {
    const res = await fetchWithAuth(`${BASE_URL}/patrols/export`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengunduh file");
    return res.blob();
  },
};

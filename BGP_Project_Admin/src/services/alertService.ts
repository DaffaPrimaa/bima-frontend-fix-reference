import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { AlertResponse } from "../types/alert";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const alertService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    status?: string;
    from?: string;
    to?: string;
  } = {}): Promise<AlertResponse> => {
    const limit = paramsObj.limit ?? 10;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.status) params.append("status", paramsObj.status);
    if (paramsObj.from) params.append("from", paramsObj.from);
    if (paramsObj.to) params.append("to", paramsObj.to);

    const res = await fetchWithAuth(`${API_BASE}/alerts?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil data panic alert");
    return result;
  },

  handle: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/alerts/${uuid}/handle`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menangani panic alert");
  },

  resolve: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/alerts/${uuid}/resolve`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menyelesaikan panic alert");
  },
};

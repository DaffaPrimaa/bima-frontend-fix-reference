import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { MessageResponse, CreateMessagePayload } from "../types/message";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const messageService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    search?: string;
    from?: string;
    to?: string;
  } = {}): Promise<MessageResponse> => {
    const limit = paramsObj.limit ?? 10;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.search) params.append("search", paramsObj.search);
    if (paramsObj.from) params.append("from", paramsObj.from);
    if (paramsObj.to) params.append("to", paramsObj.to);

    const res = await fetchWithAuth(`${API_BASE}/messages?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil riwayat pesan");
    return result;
  },

  create: async (payload: CreateMessagePayload): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/messages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengirim pesan");
  },
};

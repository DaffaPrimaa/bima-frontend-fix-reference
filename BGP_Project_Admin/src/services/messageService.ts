import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

export const messageService = {
  getAll: async (
    limit: number = 20,
    cursor?: string | null,
    search?: string,
    satpam?: string,
    unread?: boolean,
    from?: string,
    to?: string
  ) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    if (satpam) params.append("satpam", satpam);
    if (unread !== undefined) params.append("unread", unread.toString());
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const response = await fetchWithAuth(`${API_BASE}/messages?${params.toString()}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    return response.json();
  },
  create: async (payload: { satpam_uuid: string; title: string; content: string }) => {
    const response = await fetchWithAuth(`${API_BASE}/messages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || err.message || "Failed to send message");
    }

    return response.json();
  },
};

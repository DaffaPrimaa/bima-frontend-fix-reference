import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { ActivityLogResponse, ActivityActionsResponse } from "../types/activityLog";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const activityLogService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    action?: string;
    resource?: string;
    from?: string;
    to?: string;
  } = {}): Promise<ActivityLogResponse> => {
    const limit = paramsObj.limit ?? 10;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.action) params.append("action", paramsObj.action);
    if (paramsObj.resource) params.append("resource", paramsObj.resource);
    if (paramsObj.from) params.append("from", paramsObj.from);
    if (paramsObj.to) params.append("to", paramsObj.to);

    const res = await fetchWithAuth(`${API_BASE}/activity-logs?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil activity log");
    return result;
  },

  getActions: async (): Promise<ActivityActionsResponse> => {
    const res = await fetchWithAuth(`${API_BASE}/activity-logs/actions`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil daftar aksi");
    return result;
  },
};

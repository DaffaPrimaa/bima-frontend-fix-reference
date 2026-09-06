import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { ActivityLogResponse, ActivityLogActionResponse } from "../types/activityLog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const activityLogService = {
  getAll: async (params?: {
    limit?: number;
    cursor?: string | null;
    action?: string;
    resource?: string;
    from?: string;
    to?: string;
  }): Promise<ActivityLogResponse> => {
    const query = new URLSearchParams();
    
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.cursor) query.append("cursor", params.cursor);
    if (params?.action && params.action !== "all") query.append("action", params.action);
    if (params?.resource && params.resource !== "all") query.append("resource", params.resource);
    if (params?.from) query.append("from", params.from);
    if (params?.to) query.append("to", params.to);

    const res = await fetchWithAuth(`${BASE_URL}/activity-logs?${query.toString()}`, {
      headers: getHeaders(),
    });
    
    if (!res.ok) throw new Error("Gagal memuat activity logs");
    return res.json();
  },

  getActions: async (): Promise<ActivityLogActionResponse> => {
    const res = await fetchWithAuth(`${BASE_URL}/activity-logs/actions`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Gagal memuat list actions");
    return res.json();
  },
};

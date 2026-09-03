import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { DashboardSummaryResponse, OffendersResponse } from "../types/dashboard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const res = await fetchWithAuth(`${API_BASE}/dashboard`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil data dashboard");
    return result;
  },

  getOffenders: async (limit: number = 10): Promise<OffendersResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    const res = await fetchWithAuth(`${API_BASE}/dashboard/offenders?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengambil data satpam perlu diperhatikan");
    return result;
  },
};

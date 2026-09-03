import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { EventReportResponse } from "../types/eventReport";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const eventReportService = {
  getAll: async (
    limit?: number,
    cursor?: string | null,
    search?: string,
    status?: string
  ): Promise<EventReportResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    if (status && status !== "semua") params.append("status", status);

    const res = await fetchWithAuth(`${API_BASE_URL}/event-reports?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Gagal mengambil data laporan kejadian");
    }

    // Default empty array if no data
    if (!result.data) {
      result.data = [];
    }

    return result as EventReportResponse;
  },

  handleReport: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/event-reports/${uuid}/handle`, {
      method: "POST",
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      throw new Error(result.error?.message || result.message || "Gagal menangani laporan");
    }
  },

  resolveReport: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/event-reports/${uuid}/resolve`, {
      method: "POST",
      headers: getHeaders(),
    });
    
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      throw new Error(result.error?.message || result.message || "Gagal menyelesaikan laporan");
    }
  },
};

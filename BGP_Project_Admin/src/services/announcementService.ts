import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { AnnouncementResponse } from "../types/announcement";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

export const announcementService = {
  getAll: async (limit: number = 3, cursor: string | null = null, search: string = "", recipientType?: string, recipient?: string): Promise<AnnouncementResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);
    if (recipientType) params.append("recipient_type", recipientType);
    if (recipient) params.append("recipient", recipient);
    const res = await fetchWithAuth(`${API_BASE}/announcements?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  create: async (data: any): Promise<any> => {
    const res = await fetchWithAuth(`${API_BASE}/announcements`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
  getById: async (uuid: string): Promise<any> => {
    const res = await fetchWithAuth(`${API_BASE}/announcements/${uuid}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
  update: async (uuid: string, data: any): Promise<any> => {
    const res = await fetchWithAuth(`${API_BASE}/announcements/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
  updateRecipients: async (uuid: string, data: any): Promise<any> => {
    const res = await fetchWithAuth(`${API_BASE}/announcements/${uuid}/recipients`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ recipient: data }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
  delete: async (uuid: string): Promise<any> => {
    const res = await fetchWithAuth(`${API_BASE}/announcements/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};

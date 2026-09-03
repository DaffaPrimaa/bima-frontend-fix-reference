import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

export const violationService = {
  getViolations: async (satpamUuid: string, limit: number = 7, cursor: string | null = null) => {
    const params = new URLSearchParams({ satpam: satpamUuid, limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/violations?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data pelanggaran");
    return res.json();
  },
  createViolation: async (payload: { satpam_uuid: string; type: string; description: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/violations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal membuat pelanggaran");
    return result;
  },
  updateViolation: async (uuid: string, payload: { type?: string; description?: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/violations/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal mengupdate pelanggaran");
    return result;
  },
  deleteViolation: async (uuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/violations/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal menghapus pelanggaran");
    return result;
  },
};

import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { Shift, ShiftResponse, CreateShiftPayload } from "../types/shift";
import { getToken } from "../Utils/helpers";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const shiftService = {
  getAll: async (page: number): Promise<ShiftResponse> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/?pid=${page}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengambil data waktu");
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: Shift }> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/${uuid}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal mengambil detail data");
    return res.json();
  },

  create: async (payload: CreateShiftPayload): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Gagal menyimpan");
    }
  },

  update: async (uuid: string, payload: CreateShiftPayload): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/${uuid}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Gagal mengupdate");
    }
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/${uuid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Gagal menghapus data");
  },
};

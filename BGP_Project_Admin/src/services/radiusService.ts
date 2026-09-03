import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type { RadiusSettings } from "../types/radius";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const radiusService = {
  getSettings: async (): Promise<RadiusSettings> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/client/settings`, {
      method: "GET",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const result = await res.json();
    if (res.ok && result.data) {
      return result.data;
    }
    throw new Error("Gagal mengambil data pengaturan");
  },

  updateSettings: async (settings: {
    radius_utama: number;
    radius_jaga: number;
  }): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/client/settings`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        radius_utama: settings.radius_utama.toString(),
        radius_jaga: settings.radius_jaga.toString(),
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Gagal update pengaturan");
    }
  },
};

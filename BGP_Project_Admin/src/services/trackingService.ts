import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type {
  TrackingSessionResponse,
  TrackingSessionDetailResponse,
} from "../types/tracking";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const decodePolyline = (
  encoded: string | null | undefined,
  precision: number = 5,
): { lat: number; lng: number }[] => {
  if (!encoded) return [];
  const factor = Math.pow(10, precision);
  const coordinates: { lat: number; lng: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push({ lat: lat / factor, lng: lng / factor });
  }

  return coordinates;
};

export const trackingService = {
  getAll: async (
    limit: number = 20,
    cursor: string | null = null,
    search: string = "",
  ): Promise<TrackingSessionResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (search) params.append("search", search);

    const res = await fetchWithAuth(`${BASE_URL_API}/tracking-sessions?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal memuat data sesi tracking");
    return res.json();
  },

  getById: async (uuid: string): Promise<TrackingSessionDetailResponse> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/tracking-sessions/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil detail sesi tracking");
    return res.json();
  },
};

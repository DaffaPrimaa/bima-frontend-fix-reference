import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type { RequestResponse } from "../types/request";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
};

export const getRequests = async (
  cursor?: string | null,
  limit: number = 7,
  search?: string,
  type?: string,
  status?: string
): Promise<RequestResponse> => {
  const queryParams = new URLSearchParams();
  if (cursor) queryParams.append("cursor", cursor);
  queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (type) queryParams.append("type", type);
  if (status) queryParams.append("status", status);

  const response = await fetchWithAuth(`${API_BASE}/requests?${queryParams.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }

  return response.json();
};

export const acceptRequest = async (uuid: string): Promise<void> => {
  const response = await fetchWithAuth(`${API_BASE}/requests/${uuid}/accept`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to accept request");
  }
};

export const rejectRequest = async (uuid: string): Promise<void> => {
  const response = await fetchWithAuth(`${API_BASE}/requests/${uuid}/reject`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to reject request");
  }
};

import { fetchWithAuth } from "../Utils/fetchWithAuth";
import type {
  SatpamResponse,
  Satpam,
  CardDataResponse,
} from "../types/satpam";
import type { UserResponse } from "../types/user";
import { getToken } from "../Utils/helpers";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getHeaders = (isMultipart: boolean = false) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const satpamService = {
  getAll: async (paramsObj: {
    limit?: number;
    cursor?: string | null;
    status?: string;
    search?: string;
    client_uuid?: string;
    decided_within_days?: number;
  } = {}): Promise<SatpamResponse> => {
    const limit = paramsObj.limit ?? 7;
    const params = new URLSearchParams({ limit: limit.toString() });
    if (paramsObj.cursor) params.append("cursor", paramsObj.cursor);
    if (paramsObj.status) params.append("status", paramsObj.status);
    if (paramsObj.search) params.append("search", paramsObj.search);
    if (paramsObj.client_uuid && paramsObj.client_uuid !== "all") params.append("client_uuid", paramsObj.client_uuid);
    if (paramsObj.decided_within_days !== undefined) params.append("decided_within_days", paramsObj.decided_within_days.toString());
    const res = await fetchWithAuth(`${API_BASE}/satpam/?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getById: async (uuid: string): Promise<{ data: Satpam }> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getCardData: async (uuid: string): Promise<CardDataResponse> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/card-data`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  update: async (uuid: string, payload: any): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal mengupdate data satpam");
  },

  delete: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || "Gagal menghapus data");
  },

  getMitraOptions: async (cursor: string | null = null): Promise<UserResponse> => {
    const params = new URLSearchParams({ limit: "50" });
    if (cursor) params.append("cursor", cursor);
    const res = await fetchWithAuth(`${API_BASE}/client?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return res.json();
  },

  getAssignment: async (satpamUuid: string): Promise<{ data: { assigned: boolean; client?: { uuid: string; nama: string } } }> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${satpamUuid}/assignment`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data penugasan");
    return res.json();
  },

  assignMitra: async (satpamUuid: string, clientUuid: string): Promise<void> => {
    const url = `${API_BASE}/satpam/${satpamUuid}/assignment`;
    const payload = clientUuid === "unassign" ? { client_uuid: null } : { client_uuid: clientUuid };
    const body = JSON.stringify(payload);

    const res = await fetchWithAuth(url, {
      method: "PUT",
      headers: getHeaders(),
      body,
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menyimpan perubahan penugasan");
  },

  approve: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || "Gagal menyetujui akun");
  },

  reject: async (uuid: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/reject`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || "Gagal menolak akun");
  },

  getDocuments: async (uuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/documents`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil dokumen satpam");
    return res.json();
  },

  getUploadUrl: async (uuid: string, ext: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/documents/upload-url`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ext }),
    });
    if (!res.ok) throw new Error("Gagal mengambil URL unggah dokumen");
    const json = await res.json();
    return json.data || json;
  },

  getAvatarUploadUrl: async (ext: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/avatar-url`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ext }),
    });
    if (!res.ok) throw new Error("Gagal mengambil URL unggah avatar");
    const json = await res.json();
    return json.data || json;
  },

  uploadToGcs: async (uploadUrl: string, fields: Record<string, string>, file: File, maxAttempts: number = 3) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", file);

        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        if (!res.ok && res.status !== 204) {
          throw new Error("Gagal mengunggah file ke bucket");
        }
        return;
      } catch (err) {
        if (attempt === maxAttempts) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  },

  createDocument: async (uuid: string, payload: { type: string; object_uuid: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/documents`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || "Gagal membuat dokumen");
    return result;
  },

  getResource: async (uuid: string, resType: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/${resType}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Gagal mengambil data ${resType}`);
    return res.json();
  },

  getUploadUrlResource: async (uuid: string, resType: string, ext: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/${resType}/upload-url`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ext }),
    });
    if (!res.ok) throw new Error(`Gagal mengambil URL unggah ${resType}`);
    const json = await res.json();
    return json.data || json;
  },

  createResource: async (uuid: string, resType: string, payload: any) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/${resType}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || `Gagal membuat ${resType}`);
    return result;
  },

  deleteDocument: async (uuid: string, docUuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/documents/${docUuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus dokumen");
  },

  updateResource: async (uuid: string, resType: string, credUuid: string, payload: any) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/${resType}/${credUuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.error?.message || result.message || `Gagal mengupdate ${resType}`);
    return result;
  },

  deleteResource: async (uuid: string, resType: string, credUuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/satpam/${uuid}/${resType}/${credUuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Gagal menghapus ${resType}`);
  },
};

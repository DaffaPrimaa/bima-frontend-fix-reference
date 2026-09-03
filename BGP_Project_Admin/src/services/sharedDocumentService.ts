import { fetchWithAuth } from "../Utils/fetchWithAuth";
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

export const sharedDocumentService = {
  getAll: async (
    limit: number = 20, 
    cursor: string | null = null,
    search: string = "",
    recipient: string = "all"
  ) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (search.trim()) params.append("search", search.trim());
    if (recipient && recipient !== "all") {
      params.append("recipient_type", "client");
      params.append("recipient", recipient);
    }
    
    const res = await fetchWithAuth(`${API_BASE}/shared-documents?${params.toString()}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getUploadUrl: async (ext:string) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/upload-url`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ ext }),
    });
    if (!res.ok) throw new Error("Gagal mengambil URL unggah dokumen");
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

  create: async (payload: { nama: string; deskripsi?: string; object_uuid: string; recipient: any }) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal membuat dokumen");
    return result;
  },

  getById: async (uuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/${uuid}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  update: async (uuid: string, payload: { nama?: string; deskripsi?: string; object_uuid?: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/${uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal mengupdate dokumen");
    return result;
  },

  updateRecipients: async (uuid: string, recipient: any) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/${uuid}/recipients`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ recipient }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Gagal mengupdate recipient");
    return result;
  },

  remove: async (uuid: string) => {
    const res = await fetchWithAuth(`${API_BASE}/shared-documents/${uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      throw new Error(result.message || "Gagal menghapus dokumen");
    }
    return true;
  }
};

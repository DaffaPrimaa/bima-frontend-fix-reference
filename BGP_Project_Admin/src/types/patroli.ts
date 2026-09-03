export interface PatroliPhoto {
  uuid: string;
  status: string;
  view_url: string | null;
  download_url: string | null;
}

export interface Patroli {
  uuid: string;
  status: "aman" | "tidak aman";
  description: string;
  pos: { uuid: string; nama: string; kode: string; type: string };
  satpam: { uuid: string; nama: string; nip: string; client: string };
  work_date: string | null;
  photos: PatroliPhoto[];
  created_at: string;
  updated_at: string;
}

export interface PatroliResponse {
  data: Patroli[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface UpdatePatroliPayload {
  status?: "aman" | "tidak aman";
  description?: string;
}

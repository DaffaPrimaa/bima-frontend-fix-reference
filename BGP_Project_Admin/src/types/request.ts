export interface RequestSatpam {
  nama: string;
  nip: string;
  client: string;
}

export interface PengajuanRequest {
  uuid: string;
  type: "cuti" | "lembur";
  description: string;
  start_date: string;
  end_date: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  satpam: RequestSatpam;
}

export interface RequestResponse {
  data: PengajuanRequest[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface Pos {
  uuid: string | null;
  nama: string;
  kode: string;
  lat: number;
  lng: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
}

export interface PosResponse {
  data: Pos[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface CreatePosPayload {
  nama?: string;
  kode?: string;
  lat?: number;
  lng?: number;
  type?: string;
}

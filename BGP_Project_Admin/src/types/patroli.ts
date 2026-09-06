export interface PatrolPhoto {
  uuid: string;
  status: string;
  view_url: string;
  download_url: string;
}

export interface Patroli {
  uuid: string;
  status: string; // Previously status_lokasi
  description: string; // Previously keterangan
  location: {
    lat: number;
    lng: number;
  };
  distance_m: number;
  pos: {
    uuid: string;
    nama: string;
    kode: string;
    type: string;
  };
  satpam: {
    uuid: string;
    nama: string;
    nip: string;
    client: string;
  };
  attendance_uuid: string;
  work_date: string;
  photos: PatrolPhoto[]; // Previously images (which was string[])
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
  message?: string;
}

export interface UpdatePatroliPayload {
  status?: string;
  description?: string;
}


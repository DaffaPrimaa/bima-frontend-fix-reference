export interface Location {
  lat: number;
  lng: number;
}

export interface Satpam {
  uuid: string;
  nama: string;
  nip: string;
  client: string;
}

export interface Photo {
  uuid: string;
  status: string;
  view_url: string | null;
  download_url: string | null;
}

export interface EventReport {
  uuid: string;
  description: string;
  status: "pending" | "handled" | "resolved";
  location: Location;
  satpam: Satpam;
  photos: Photo[];
  created_at: string;
  updated_at: string;
}

export interface EventReportResponse {
  data: EventReport[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface AlertSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface Alert {
  uuid: string;
  status: "active" | "handled" | "resolved";
  lat: number;
  lng: number;
  satpam: AlertSatpam;
  client: string;
  created_at: string;
  updated_at: string;
}

export interface AlertResponse {
  data: Alert[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

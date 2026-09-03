export interface Satpam {
  kontak_utama: string | undefined;
  uuid: string;
  nama: string;
  asal_daerah: string;
  nip: string;
  no_telp: string;
  nomor_hp?: string;
  image_url?: string;
  created_at?: string;
  client?: string;
  gender?: string;
  status?: string;
  jabatan?: string;
  role?: string;
  email?: string;
  status_updated_at?: string;
  user_uuid?: string;
  kontak_sekunder?: string | null;
  nrg?: string;
  avatar?: {
    uuid: string;
    status: string;
    view_url: string;
    download_url: string;
  };
  enrolled?: boolean;
  updated_at?: string;
  date_assigned?: string;
  working_hours?: {
    this_month?: {
      hours?: number;
      shifts?: number;
    };
    all_time?: {
      hours?: number;
      since?: string;
    };
    since?: string;
  };
}

export interface CardData {
  nama: string;
  jabatan: string;
  nip: string;
  nrg: string;
  client: string;
  avatar_url: string;
}

export interface CardDataResponse {
  data: CardData;
}

export interface MitraOption {
  uuid: string;
  nama: string;
}

export interface SatpamResponse {
  data: Satpam[];
  meta?: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
  message?: string;
}

export interface MitraOptionsResponse {
  data: MitraOption[];
}

export interface FormErrors {
  nama?: string;
  asal_daerah?: string;
  nip?: string;
  no_telp?: string;
  image?: string;
}

export interface CreateSatpamPayload {
  nama: string;
  asal_daerah: string;
  nip: string;
  no_telp: string;
  image?: File | null;
}

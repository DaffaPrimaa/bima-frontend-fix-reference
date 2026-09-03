export interface Shift {
  uuid: string;
  nama: string;
  mulai: string;
  selesai: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShiftResponse {
  data: Shift[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface CreateShiftPayload {
  nama: string;
  start_local: string;
  end_local: string;
  timezone?: string;
}

export interface FormErrors {
  nama?: string;
  mulai?: string;
  selesai?: string;
}

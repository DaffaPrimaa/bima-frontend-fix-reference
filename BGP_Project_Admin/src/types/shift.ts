export interface Shift {
  uuid: string;
  nama: string;
  mulai: string;
  selesai: string;
  created_at?: string;
  timezone?: string;
}

export interface ShiftResponse {
  data: {
    data: Shift[];
    pagination?: {
      total_pages: number;
      items_per_page: number;
      current_page: number;
      total_items: number;
    };
  };
  message?: string;
}

export interface CreateShiftPayload {
  nama: string;
  mulai: string;
  selesai: string;
  timezone?: string;
}

export interface FormErrors {
  nama?: string;
  mulai?: string;
  selesai?: string;
}

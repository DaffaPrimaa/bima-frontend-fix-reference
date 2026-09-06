export interface ShiftPattern {
  uuid: string;
  nama: string;
  start_local: string;
  end_local: string;
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShiftPatternResponse {
  data: ShiftPattern[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface ShiftPatternSingleResponse {
  data: ShiftPattern;
}

export interface CreateShiftPatternPayload {
  nama: string;
  start_local: string;
  end_local: string;
  timezone: string;
}

export interface UpdateShiftPatternPayload {
  nama?: string;
  start_local?: string;
  end_local?: string;
  timezone?: string;
}

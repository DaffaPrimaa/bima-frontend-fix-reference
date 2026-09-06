export interface Absensi {
  uuid: string;
  work_date: string;
  status: string;
  expected_starts_at: string;
  expected_ends_at: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  difference_minutes: number | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  worked_minutes: number | null;
  check_in_location: { lat: number; lng: number } | null;
  check_out_location: { lat: number; lng: number } | null;
  check_in_distance_m: number | null;
  check_out_distance_m: number | null;
  edited_by: string;
  scheduled: boolean;
  shift: {
    instance_uuid: string;
    pattern: string;
    pos: {
      uuid: string;
      nama: string;
    };
  };
  satpam: {
    uuid: string;
    nama: string;
    nip: string;
    client: string;
  };
  created_at: string;
}

export interface AttendanceResponse {
  data: Absensi[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface UpdateAttendancePayload {
  checked_in_at?: string;
  checked_out_at?: string;
}

export interface FormData {
  checked_in_at: string;
  checked_out_at: string;
}

export interface Absensi {
  uuid: string;
  work_date: string;
  status: "pending" | "present" | "late" | "partial" | "absent" | "excused";
  expected_starts_at: string | null;
  expected_ends_at: string | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  worked_minutes: number | null;
  satpam: {
    uuid: string;
    nama: string;
    nip: string;
    client: string;
  };
  shift: {
    instance_uuid: string;
    pattern: string;
    pos: { uuid: string; nama: string };
  } | null;
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

export interface AttendanceDetailResponse {
  data: Absensi;
}

export interface UpdateAttendancePayload {
  checked_in_at?: string | null;
  checked_out_at?: string | null;
}

export interface FormData {
  check_in: string;
  check_out: string;
}

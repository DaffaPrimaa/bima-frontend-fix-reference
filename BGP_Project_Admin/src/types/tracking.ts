export type TrackingSessionStatus = "active" | "closed" | "auto-closed";

export interface TrackingSessionAttendance {
  uuid: string;
  status: "pending" | "present" | "late" | "partial" | "absent" | "excused";
  checked_in_at: string | null;
  checked_out_at: string | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
}

export interface TrackingSessionSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface TrackingSession {
  uuid: string;
  status: TrackingSessionStatus;
  work_date: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  duration_minutes: number | null;
  distance_meters: number;
  attendance: TrackingSessionAttendance;
  satpam: TrackingSessionSatpam;
  created_at: string;
}

export interface TrackingSessionDetail extends TrackingSession {
  clean_polyline: string | null;
}

export interface TrackingSessionResponse {
  data: TrackingSession[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface TrackingSessionDetailResponse {
  data: TrackingSessionDetail;
}

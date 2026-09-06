import { CalendarDate } from "@internationalized/date";

export interface SatpamOption {
  uuid: string;
  nama: string;
  nip: string;
}

export interface ShiftOption {
  end_local: any;
  start_local: any;
  uuid: string;
  nama: string;
  mulai: string;
  selesai: string;
}

export interface PosOption {
  uuid: string;
  nama: string;
}

export interface Jadwal {
  uuid: string;
  work_date: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "cancelled" | "completed";
  satpam: { uuid: string; nama: string; nip: string; jabatan?: string };
  pattern: { uuid: string; nama: string; timezone: string };
  pos: { uuid: string; nama: string };
  assignment?: { uuid: string };
  assignment_uuid?: string;
  recurrence_id?: string;
}

export interface ScheduleResponse {
  data: Jadwal[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface ScheduleDetailResponse {
  data: Jadwal;
}

export interface CreateJadwalBody {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  tanggal: string;
}

export interface GenerateJadwalBody {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  start_date: string;
  end_date: string;
  days_of_week: number[];
}

export interface FormData {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  tanggal: CalendarDate | null;
}

export interface GenerateFormData {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  start_date: CalendarDate | null;
  end_date: CalendarDate | null;
  days_of_week: string[];
}

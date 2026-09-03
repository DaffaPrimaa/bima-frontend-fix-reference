import type { ReactNode } from "react";

export interface UserPayload {
  role: string;
  nama: string;
  [key: string]: any;
}

export interface MenuItem {
  title: string;
  desc: string;
  icon: ReactNode;
  color: string;
  path: string;
  allowedRoles: string[];
}

export interface AdminDashboardData {
  satpam: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    rejected: number;
    resign: number;
    unassigned: number;
  };
  gender: Record<string, number>;
  clients: {
    total: number;
    distribution: { uuid: string; nama: string; satpam: number }[];
  };
}

export interface AttendanceBreakdown {
  ontime: number;
  late: number;
  partial: number;
  absent: number;
  excused: number;
  cuti: number;
  lembur: number;
  cuti_lembur: number;
}

export interface ClientDashboardData {
  date: string;
  satpam_assigned: number;
  posts: number;
  scheduled_today: number;
  checked_in_today: number;
  active_alerts: number;
  today: AttendanceBreakdown;
  all_time: AttendanceBreakdown;
}

export interface DashboardSummaryResponse {
  data: AdminDashboardData | ClientDashboardData;
  meta: { scope: "admin" | "client" };
}

export interface OffenderItem {
  uuid: string;
  nama: string;
  nip: string;
  client: string;
  late: number;
  absent: number;
  teguran: number;
  sp: number;
  total: number;
}

export interface OffendersResponse {
  data: OffenderItem[];
  meta: { since: string; days: number; limit: number; ranked: number };
}

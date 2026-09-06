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

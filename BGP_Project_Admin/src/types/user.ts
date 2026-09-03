export interface User {
  uuid: string;
  user_uuid: string;
  nama: string;
  email: string;
  status: string;
  radius_utama: number;
  radius_jaga: number;
  member_count: number;
  created_at: string;
}

export interface CreateUserPayload {
  nama: string;
  email: string;
  password?: string;
}

export interface UserResponse {
  data: User[];
  meta?: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
  message?: string;
}

export interface FormErrors {
  nama?: string;
  email?: string;
  password?: string;
}

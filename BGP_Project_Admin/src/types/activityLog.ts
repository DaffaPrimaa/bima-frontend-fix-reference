export interface ActivityLogActor {
  nama: string;
  email: string;
  role: string;
}

export interface ActivityLogItem {
  uuid: string;
  action: string;
  resource: string;
  actor: ActivityLogActor;
  payload: Record<string, any>;
  created_at: string;
}

export interface ActivityLogMeta {
  limit: number;
  has_more: boolean;
  next_cursor: string | null;
}

export interface ActivityLogResponse {
  data: ActivityLogItem[];
  meta: ActivityLogMeta;
}

export interface ActivityLogActionItem {
  action: string;
  resource: string;
}

export interface ActivityLogActionResponse {
  data: ActivityLogActionItem[];
}

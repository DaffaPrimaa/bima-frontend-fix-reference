export interface ActivityLogActor {
  nama: string;
  email: string;
  role: string;
}

export interface ActivityLog {
  uuid: string;
  action: string;
  resource: string;
  actor: ActivityLogActor;
  payload: Record<string, any>;
  created_at: string;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface ActivityAction {
  action: string;
  resource: string;
}

export interface ActivityActionsResponse {
  data: ActivityAction[];
}

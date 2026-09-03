export interface Announcement {
  uuid: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  created_at: string;
  updated_at: string;
  recipient_type: string;
  recipient_count: number;
}

export interface AnnouncementMeta {
  limit: number;
  has_more: boolean;
  next_cursor: string | null;
}

export interface AnnouncementResponse {
  data: Announcement[];
  meta: AnnouncementMeta;
}

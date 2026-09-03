export interface MessageSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface Message {
  uuid: string;
  title: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  satpam: MessageSatpam;
}

export interface MessageResponse {
  data: Message[];
  meta: {
    limit: number;
    has_more: boolean;
    next_cursor: string | null;
  };
}

export interface CreateMessagePayload {
  satpam_uuid: string;
  title: string;
  content: string;
}

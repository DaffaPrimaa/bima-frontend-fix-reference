export interface MessageSatpam {
  uuid: string;
  nama: string;
  nip: string;
}

export interface MessageItem {
  uuid: string;
  title: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  satpam: MessageSatpam;
}

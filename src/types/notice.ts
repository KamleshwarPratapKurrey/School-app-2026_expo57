export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  date: string;
  attachment: string | null;
}

export interface NoticesApiResponse {
  status: boolean;
  data: NoticeItem[];
  message?: string;
}
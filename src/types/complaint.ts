export interface CreateComplaintPayload {
  student_id: number | string;
  title: string;
  description: string;
  complaint_date: string; // "YYYY-MM-DD"
}

export interface ComplaintRecord {
  id: number;
  teacher_id: number;
  student_id: number;
  title: string;
  description: string;
  complaint_date: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ComplaintApiResponse {
  status: boolean;
  message: string;
  data: ComplaintRecord;
}

export interface SubmitComplaintParams {
  endpoint: string;
  token?: string | null;
  formData: CreateComplaintPayload;
}

// getting complaints 
export interface ComplaintListItem {
  id: number;
  title: string;
  description: string;
  date: string;
  teacher: string;
  student: string;
}

export interface AllComplaintsApiResponse {
  status: boolean;
  data: ComplaintListItem[];
  message?: string;
}
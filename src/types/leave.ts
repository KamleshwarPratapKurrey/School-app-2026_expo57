export interface CreateLeavePayload {
  from_date: string;
  to_date: string;
  reason: string;
  photo?: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

export interface LeaveRecord {
  id: number;
  user_id: number;
  user_type: string;
  from_date: string;
  to_date: string;
  reason: string;
  photo_path: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveApiResponse {
  status: boolean;
  message: string;
  data: LeaveRecord;
}

export interface SubmitLeaveParams {
  endpoint: string;
  token?: string | null;
  formData: CreateLeavePayload;
}

// getting Leaves 
export interface LeaveApplicationItem {
  id: number;
  from_date: string;
  to_date: string;
  reason: string;
  photo: string | null;
  status: "Pending" | "Approved" | "Rejected" | string;
}

export interface AllLeaveApiResponse {
  status: boolean;
  data: LeaveApplicationItem[];
  message?: string;
}


export interface AttendanceSummary {
  total_working_days: number;
  total_present: number;
  total_absent: number;
  overall_percentage: number;
}

export interface AttendanceRecord {
  id: number;
  month: string;
  working_days: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface AttendanceApiResponse {
  status: boolean;
  summary: AttendanceSummary;
  data: AttendanceRecord[];
  message?: string;
}
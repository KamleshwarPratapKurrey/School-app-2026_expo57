export interface ExamScheduleItem {
  id: number;
  class: string;
  subject: string;
  date: string;
  start_time: string;
  end_time: string;
  room_no: string;
}

export interface ExamTimeTableGroup {
  exam_name: string;
  schedules: ExamScheduleItem[];
}

export interface ExamTimeTableApiResponse {
  status: boolean;
  data: ExamTimeTableGroup[];
  message?: string;
}
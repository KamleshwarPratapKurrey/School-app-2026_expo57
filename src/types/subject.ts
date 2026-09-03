export interface SubjectItem {
  id: number;
  subject: string;
  sub_type: "Main" | "Additional" | "Activity" | string;
}

export interface SubjectsApiResponse {
  status: boolean;
  data: SubjectItem[];
  message?: string;
}
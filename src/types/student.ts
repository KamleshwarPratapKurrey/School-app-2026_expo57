export interface StudentItem {
  admission_number: number;
  name: string;
  roll_no: string | null;
  gender: string | null;
}

export interface ClassStudentGroup {
  class_id: number;
  section_id: number | null;
  students: StudentItem[];
}

export interface TeacherStudentsApiResponse {
  status: boolean;
  data: ClassStudentGroup[];
  message?: string;
}
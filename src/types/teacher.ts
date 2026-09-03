export interface ClassTeacher {
  name: string;
  phone: string | null;
}

export interface SubjectTeacher {
  name: string;
  subject: string;
  phone: string | null;
}

export interface TeachersData {
  class_teacher: ClassTeacher | null;
  subject_teachers: SubjectTeacher[];
}

export interface TeachersApiResponse {
  status: boolean;
  data: TeachersData;
  message?: string;
}
export interface PersonalDetails {
    name: string;
    phone: string;
    department: string;
    staff_type: string;
}

export interface SubjectTaughtItem {
    class_id: number;
    subject: string;
    sub_type: string;
}

export interface TeacherProfileData {
    personal_details: PersonalDetails;
    subjects_taught: SubjectTaughtItem[];
}

export interface TeacherProfileApiResponse {
    status: boolean;
    data: TeacherProfileData;
    message?: string;
}

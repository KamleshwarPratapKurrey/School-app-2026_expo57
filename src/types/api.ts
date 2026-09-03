export type User = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string | "staff" | "Student";
  user_id: string;
  session: {
    id: number;
    year: string;
  };
};
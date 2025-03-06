export interface User {
  user_id: number; // added in the backend
  username: string;
  email: string;
  password?: string; // needed?
  role: string;
}

export interface Task {
  id?: number; // added in the backend
  title: string;
  description: string;
  priority: number;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: number;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

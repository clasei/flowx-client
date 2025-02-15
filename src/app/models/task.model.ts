export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: number;
  createdAt: Date;
  updatedAt?: Date;
}

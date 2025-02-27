export interface Task {
  id?: number; // added in the backend
  title: string;
  description: string;
  priority: number;
  completed?: boolean;

  repeating: boolean; // default: false
  repeatInterval?: number | null;
  nextRepeatDate?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
  
}

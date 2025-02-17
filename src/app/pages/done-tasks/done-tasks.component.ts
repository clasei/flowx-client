import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-done-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done-tasks.component.html',
  styleUrl: './done-tasks.component.scss'
})
export class DoneTasksComponent implements OnInit {
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchDoneTasks();
  }

  fetchDoneTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.doneTasks = tasks.filter(task => task.completed);
    });
  }

  deleteAllDoneTasks(): void {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
      this.taskService.deleteAllDoneTasks().subscribe(() => {
        this.doneTasks = []; // Clear local state
      });
    }
  }

  deleteTask(task: Task): void {
    if (!task.id) { // force to check if task.id is undefined
      console.error("❌ Error: Task ID is undefined. Cannot delete.");
      return;
    }
  
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.doneTasks = this.doneTasks.filter(t => t.id !== task.id);
      });
    }
  }
  
  
}

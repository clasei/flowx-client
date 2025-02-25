import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { DoneTasksListComponent } from '../../components/done-tasks-list/done-tasks-list.component';

@Component({
  selector: 'app-done-tasks',
  standalone: true,
  imports: [CommonModule, DoneTasksListComponent],
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

  handleDeleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.doneTasks = this.doneTasks.filter(t => t.id !== taskId);
    });
  }

  handleDeleteAllTasks(): void {
    this.taskService.deleteAllDoneTasks().subscribe(() => {
      this.doneTasks = [];
    });
  }
}
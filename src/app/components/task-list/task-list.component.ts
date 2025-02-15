import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  providers: [TaskService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []; // store feched tasks
  isAscending: boolean = true; // sort order

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // this.tasks = tasks;
        this.tasks = tasks.sort((a, b) => a.priority - b.priority); // sort tasks by priority
        console.log('Tasks loaded:', tasks);
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.tasks.reverse();
  }

}

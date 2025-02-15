import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})


export class TaskItemComponent {
  @Input() task!: Task; // receives data from parent component (task-list)

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1: return 'low';
      case 2: return 'medium';
      case 3: return 'high';
      default: return 'unknown';
    }
  }

  getPriorityText(priority: number): string {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  }
}

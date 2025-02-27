import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})


export class TaskItemComponent {
  @Input() task!: Task; // receive data from parent component (task-list)
  @Input() isDoneTasksView: boolean = false; // receive data from parent component (task-list)
  @Output() toggleCompleted = new EventEmitter<Task>(); // emit event to parent (task-list)
  @Output() deleteTask = new EventEmitter<Task>(); // emit the whole task to parent
  @Output() editTask = new EventEmitter<Task>();
  @Output() undoTask = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {}

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1: return 'critical';
      case 2: return 'focus';
      case 3: return 'pipeline';
      default: return 'unknown';
    }
  }

  getPriorityText(priority: number): string {
    switch (priority) {
      case 1: return 'critical';
      case 2: return 'focus';
      case 3: return 'pipeline';
      default: return 'unknown';
    }
  }

  onCheckboxChange() {
    this.task.completed = !this.task.completed; // update local ui
    this.toggleCompleted.emit(this.task); // send update to parent
  }

  onDeleteClick() {
    console.log("🛠️ deleting task:", this.task); 
    this.deleteTask.emit(this.task);
  }

  onEditClick() {
    console.log("📝 Editing task:", this.task);
    this.editTask.emit(this.task);
  }
  
  onUndoClick() {
    console.log("🔄 re-do clicked:", this.task);
    this.undoTask.emit(this.task);
  }

  // getRepeatIntervalText(days: number): string {
  //   if (!days) return ''; // handle null or undefined
  //   const intervals: { [key: number]: string } = {
  //     1: 'day',
  //     7: 'week',
  //     14: '2 weeks',
  //     21: '3 weeks',
  //     30: 'month',
  //     90: 'quarter',
  //     365: 'year',
  //   };
  //   return intervals[days] || `${days} days`;
  // }
  
  // using the method from the service
  getRepeatIntervalText(days: number): string {
    return this.taskService.getRepeatIntervalText(days);
  }
  
}
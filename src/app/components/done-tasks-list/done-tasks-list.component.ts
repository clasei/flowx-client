import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal.component'; 


@Component({
  selector: 'app-done-tasks-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, DeleteConfirmationModalComponent],
  templateUrl: './done-tasks-list.component.html',
  styleUrl: './done-tasks-list.component.scss'
})
export class DoneTasksListComponent {

  @Input() doneTasks: Task[] = [];  // receive done tasks from parent component
  @Output() deleteTask = new EventEmitter<number>(); // emit id task to delete
  @Output() deleteAllTasks = new EventEmitter<void>(); // emit event to delete all tasks

  showDeleteModal: boolean = false;
  showDeleteAllModal: boolean = false;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchDoneTasks();
  }

  // fetchDoneTasks(): void {
  //   this.taskService.getTasks().subscribe(tasks => {
  //     this.doneTasks = tasks.filter(task => task.completed);
  //   });
  // }

  fetchDoneTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.doneTasks = tasks
        .filter(task => task.completed)
        .sort((a, b) => 
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        ); // guarantee no errors if there's no updatedAt
    });
  }
  
  onToggleTask(task: Task): void {
    this.taskService.toggleTaskCompletion(task).subscribe(updatedTask => {
      // update ui
      const index = this.doneTasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.doneTasks.splice(index, 1); // remove task if undone
      }
    });
  }
  
  openDeleteModal(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.taskToDelete) return;
    this.deleteTask.emit(this.taskToDelete.id!);
    this.showDeleteModal = false;
  }

  openDeleteAllModal(): void {
    this.showDeleteAllModal = true;
  }

  confirmDeleteAll(): void {
    this.deleteAllTasks.emit();
    this.showDeleteAllModal = false;
  }

  deleteAllDoneTasks(): void {
    this.taskService.deleteAllDoneTasks().subscribe({
      next: () => {
        this.doneTasks = [];
        this.showDeleteAllModal = false;
      },
      error: (err) => {
        console.error("❌ Error deleting all done tasks:", err);
        this.showDeleteAllModal = false;
      }
    });
  }

}

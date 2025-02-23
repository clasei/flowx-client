import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal.component'; 

@Component({
  selector: 'app-done-tasks',
  standalone: true,
  imports: [CommonModule, DeleteConfirmationModalComponent],
  templateUrl: './done-tasks.component.html',
  styleUrl: './done-tasks.component.scss'
})
export class DoneTasksComponent implements OnInit {
  doneTasks: Task[] = [];
  showDeleteModal: boolean = false;
  showDeleteAllModal: boolean = false;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchDoneTasks();
  }

  fetchDoneTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.doneTasks = tasks.filter(task => task.completed);
    });
  }

  openDeleteModal(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.taskToDelete) return;
    
    this.taskService.deleteTask(this.taskToDelete.id!).subscribe(() => {
      this.doneTasks = this.doneTasks.filter(t => t.id !== this.taskToDelete!.id);
      this.showDeleteModal = false;
    });
  }

  openDeleteAllModal(): void {
    this.showDeleteAllModal = true;
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
  

  // COMMENTED WHILE TESTING MODAL --------------

  // deleteAllDoneTasks(): void {
  //   if (confirm("Are you sure you want to delete all completed tasks?")) {
  //     this.taskService.deleteAllDoneTasks().subscribe(() => {
  //       this.doneTasks = []; // clear local state aka tasks in ui
  //     });
  //   }
  // }

  // deleteTask(task: Task): void {
  //   if (!task.id) { // force to check if task.id is undefined
  //     console.error("❌ Error: Task ID is undefined. Cannot delete.");
  //     return;
  //   }
  
  //   if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
  //     this.taskService.deleteTask(task.id).subscribe(() => {
  //       this.doneTasks = this.doneTasks.filter(t => t.id !== task.id);
  //     });
  //   }
  // }
  
  
}

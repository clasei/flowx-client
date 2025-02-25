import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { DeleteConfirmationModalComponent } from '../../components/delete-confirmation-modal/delete-confirmation-modal.component'; 


@Component({
  selector: 'app-done-tasks-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, DeleteConfirmationModalComponent],
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
  showEditModal = false;
  taskToEdit: Task | null = null;
  taskSaved: boolean = false;
  showUndoModal: boolean = false;
  taskToUndo: Task | null = null;

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


  // onToggleTask(task: Task): void {
  //   if (task.completed) {
  //     // normal toggle (task marked as done), no confirmation needed
  //     this.taskService.toggleTaskCompletion(task).subscribe(updatedTask => {
  //       console.log("✅ task marked as completed:", updatedTask);
  //     });
  //   } else {
  //     // user is trying to undo the task → show the undo confirmation modal
  //     this.taskToUndo = task;
  //     this.showUndoModal = true;
  //   }
  // }
  
  
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

  // -------------------- edit task starts here

  openEditModal(task: Task) {
    this.taskToEdit = { ...task }; // clone task for editing
    this.showEditModal = true;
  }

  saveEditedTask(): void {
    if (!this.taskToEdit) return;
  
    this.taskService.updateTask(this.taskToEdit).subscribe(updatedTask => {
      // Find the index and update the list
      const index = this.doneTasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.doneTasks[index] = updatedTask;
      }
  
      this.showEditModal = false;
      this.taskToEdit = null;
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.taskToEdit = null;
  }

  // -------------------- confirm undo 

  openUndoModal(task: Task): void {
    this.taskToUndo = task;
    this.showUndoModal = true;
  }

  confirmUndo(): void {
    if (!this.taskToUndo) return;
  
    this.taskService.toggleTaskCompletion(this.taskToUndo).subscribe(updatedTask => {
      console.log("⏪ task undone:", updatedTask);
  
      // update ui
      const index = this.doneTasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.doneTasks.splice(index, 1);
      }
  
      // reset modal
      this.taskToUndo = null;
      this.showUndoModal = false;
    });
  }
  

}

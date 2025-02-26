import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  // providers: [TaskService], // commentend, TaskService provided in root ---
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []; // current tasks
  allTasks: Task[] = []; // store full list to reset filtering
  isPriorityAscending: boolean = true; // priority sort order
  isDateAscending: boolean = true; // date sort order
  selectedFilter: string = 'all'; // active filter
  showTopTasks: boolean = false; // slider for "show only 3 tasks"
  showCompleted: boolean = false; // default: hide all

  // modals + form fields
  showModal: boolean = false;
  showDiscardModal: boolean = false;
  newTaskTitle: string = "";
  newTaskDescription: string = "";
  newTaskPriority: number = 3; // default priority (pipeline)
  showEditModal = false;
  taskToEdit: Task | null = null;
  taskSaved: boolean = false;


  // form validation states
  // typingTimeout: any; // debounce timeout if needed
  titleError: string = "";
  descriptionError: string = "";
  isFormValid: boolean = false;

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.fetchTasks();
  }

  // // PENDING: implement user settings
  // userSettings = {
  //   maxTasks: 10, // default limit
  //   defaultSort: 'oldest',
  // };

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('tasks loaded:', tasks);
        this.allTasks = tasks ?? []; // ensure it's always an array
        this.applyFilters();
      },
      error: (err) => console.error('error fetching tasks:', err)
    });
  }

  showDeleteModal = false;
  taskToDelete: Task | null = null;

  openDeleteModal(task: Task) {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.taskToDelete) return;
  
    this.taskService.deleteTask(this.taskToDelete.id!).subscribe({
      next: () => {
        console.log(`✅ Task deleted: ${this.taskToDelete!.title}`);
        this.allTasks = this.allTasks.filter(t => t.id !== this.taskToDelete!.id);
        this.applyFilters();
        this.showDeleteModal = false; // Close modal after delete
      },
      error: (err) => console.error("❌ Error deleting task:", err),
    });
  }

  // -------------------- filtering & sorting starts here

  applyFilters(): void {
    this.tasks = this.taskService.filterAndSortTasks(
      this.allTasks,
      this.selectedFilter,
      this.showCompleted,
      this.isPriorityAscending,
      this.showTopTasks
    );
  }

  toggleSortOrder(): void {
    if (this.selectedFilter === 'all') {
      this.isPriorityAscending = !this.isPriorityAscending;
      this.applyFilters();
    }
  }

  getPriorityLabel(priority: number): string {
    const labels: Record<number, string> = { 1: "critical", 2: "focus", 3: "pipeline" };
    return labels[priority] || "queue";
  }

  filterTasks(event: Event) {
    this.selectedFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  toggleTopTasks(): void {
    this.showTopTasks = !this.showTopTasks;
    this.applyFilters();
  }

  toggleShowCompleted(): void {
    this.showCompleted = !this.showCompleted;
    this.applyFilters();
  }

  // -------------------- task item starts here
  
  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task).subscribe(taskUpdated => {
      this.allTasks = this.allTasks.map(t => t.id === taskUpdated.id ? taskUpdated : t);
      this.applyFilters();
    });
  }


  // -------------------- edit task starts here

  openEditModal(task: Task) {
    this.taskToEdit = { ...task }; // clone task for editing
    this.showEditModal = true;
  }

  saveEditedTask() {
    if (!this.taskToEdit) return;
    
    this.taskService.updateTask(this.taskToEdit).subscribe(updatedTask => {
      console.log("✅ Task updated:", updatedTask);
      this.allTasks = this.allTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      this.applyFilters();
      this.showEditModal = false;
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.taskToEdit = null;
  }
  
    
  
  // -------------------- modal starts here

  validateForm(): void {
    this.titleError = "";
    this.descriptionError = "";
    this.isFormValid = true; 
    // clearTimeout(this.typingTimeout); // reset timeout on each keypress

    if (this.newTaskTitle.trim().length < 3) {
      this.titleError = "title must be at least 3 characters";
      this.isFormValid = false;
    } else if (this.newTaskTitle.trim().length > 120) {
      this.titleError = "title must be less than 120 characters";
      this.isFormValid = false;
    }

    if (this.newTaskDescription.trim().length > 490) {
      this.descriptionError = "description must be less than 490 characters";
      this.isFormValid = false;
    }
  }

  openNewTaskModal(): void {
    this.showModal = true; // just opens the modal
  }

  closeModal(): void {
    if (!this.taskSaved && (this.newTaskTitle || this.newTaskDescription)) {
      this.showDiscardModal = true;
    } else {
      this.resetFormAndClose();
    }
  }
  
  confirmDiscard(): void {
    this.showDiscardModal = false;
    this.resetFormAndClose();
  }
  
  resetFormAndClose(): void {
    this.showModal = false;
    this.showDiscardModal = false;
    this.taskSaved = false;
    this.newTaskTitle = "";
    this.newTaskDescription = "";
    this.newTaskPriority = 3;
    this.titleError = "";
    this.descriptionError = "";
    this.isFormValid = false;
  }

  createTask(task: Task): void {
    this.taskService.createTask(task).subscribe({
      next: (createdTask) => {
        this.allTasks.push(createdTask);
        this.applyFilters();
        // console.log("task created:", createdTask);
      },
      error: (err) => console.error("error creating task:", err),
    });
  }

  saveTask(): void {
    if (!this.newTaskTitle.trim()) {
      console.error("title cannot be empty!");
      return;
    }
  
  
    const newTask: Task = {
      // id: 0, // backend generates the ID
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      priority: this.newTaskPriority
      // completed: false,
      // createdAt: new Date(),
      // updatedAt: new Date(),
    };
  
    console.log("📤 sending new task to backend:", newTask);
  
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // console.log("✅ task successfully created:", createdTask);

        this.allTasks = [...this.allTasks, createdTask]; // create new array
        this.applyFilters(); // reapply filters to refresh

        this.taskSaved = true;

        this.closeModal();
      },
      error: (err) => console.error("❌ error creating task:", err),
    });
  }  


}

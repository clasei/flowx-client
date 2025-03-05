import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AuthService } from '../../services/auth.service';

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

  titleError: string = "";
  descriptionError: string = "";
  isFormValid: boolean = false;
  showDeleteModal = false;
  taskToDelete: Task | null = null;

  username: string = '';

  // constructor(private taskService: TaskService) {}
  constructor(private taskService: TaskService, private authService: AuthService) {}

  
  // ngOnInit(): void {
  //   this.fetchTasks();
  // }

  ngOnInit(): void {
    this.fetchTasks();
    this.checkForRepeatingTasks();
  
    setInterval(() => {
      this.checkForRepeatingTasks();
    }, 300000);

    // Load the username from localStorage
    const storedUsername = this.authService.getUsername();
    if (storedUsername) {
      this.username = storedUsername;
    }
  }
  
  checkForRepeatingTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      const now = new Date();
  
      const overdueTasks = tasks.filter(task =>
        task.repeating &&
        task.completed &&
        task.nextRepeatDate &&
        new Date(task.nextRepeatDate) <= now
      );
  
      overdueTasks.forEach(task => {
        console.log(`🔄 Reactivating task: ${task.title}`);
        task.completed = false;
        task.nextRepeatDate = null;
  
        this.taskService.updateTask(task).subscribe();
      });
    });
  }
  
  calculateNextRepeatDate(days: number): Date {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  // // PENDING: implement user settings
  // userSettings = {
  //   maxTasks: 10, // default limit
  //   defaultSort: 'oldest',
  // };

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('✅ tasks loaded:', tasks);
        this.allTasks = (tasks ?? [])
          .sort((a, b) => 
            new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
          );
        this.applyFilters();
      },
      error: (err) => console.error('❌ error fetching tasks:', err)
    });
  }
  

  // fetchTasks(): void {
  //   this.taskService.getTasks().subscribe({
  //     next: (tasks) => {
  //       console.log('tasks loaded:', tasks);
  //       // this.allTasks = tasks ?? []; // ensure it's always an array
  //       this.allTasks = (tasks ?? [])
  //         .sort((a, b) => 
  //           new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  //         );

  //       this.applyFilters();
  //     },
  //     error: (err) => console.error('error fetching tasks:', err)
  //   });
  // }
  

  openDeleteModal(task: Task) {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.taskToDelete) return;
  
    this.taskService.deleteTask(this.taskToDelete.task_id!).subscribe({
      next: () => {
        console.log(`✅ Task deleted: ${this.taskToDelete!.title}`);
        this.allTasks = this.allTasks.filter(t => t.task_id !== this.taskToDelete!.task_id);
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
      this.allTasks = this.allTasks.map(t => t.task_id === taskUpdated.task_id ? taskUpdated : t);
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
      this.allTasks = this.allTasks.map(t => t.task_id === updatedTask.task_id ? updatedTask : t);
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

  newTask: Task = {
    title: '',
    description: '',
    priority: 3,
    repeating: false,
    repeatInterval: null,
    nextRepeatDate: null
  };
  

  saveTask(): void {
    if (!this.newTaskTitle.trim()) {
      console.error("title cannot be empty!");
      return;
    }
    
  
    // Calculate nextRepeatDate based on the interval, if repeating
    let nextRepeatDate = null;
    if (this.newTask.repeating && this.newTask.repeatInterval) {
      nextRepeatDate = this.calculateNextRepeatDate(this.newTask.repeatInterval);
    }

    const newTask: Task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      repeating: this.newTask.repeating,  // ✅ Use user selection
      repeatInterval: this.newTask.repeatInterval || null,  // ✅ Only set if repeating
      nextRepeatDate: nextRepeatDate, // ✅ Calculate it only if repeating
    };

  
    console.log("📤 sending new task to backend:", newTask);
  
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        console.log("✅ task successfully created:", createdTask);

        this.allTasks = [...this.allTasks, createdTask]; // create new array
        this.applyFilters(); // reapply filters to refresh

        this.taskSaved = true;
        this.closeModal();
      },
      error: (err) => console.error("❌ error creating task:", err),
    });
  }  


}

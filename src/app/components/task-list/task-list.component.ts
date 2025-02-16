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
  providers: [TaskService],
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

  // modal + form fields
  showModal: boolean = false;
  showDiscardModal: boolean = false;
  newTaskTitle: string = "";
  newTaskDescription: string = "";
  newTaskPriority: number = 3; // default priority (pipeline)

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

  // confirmDeleteTask(task: Task): void {
  //   console.log("🛠️ Task to delete:", task); // Debugging

  //   if (!task || !task.id) {
  //     console.error("❌ Task ID is undefined. Cannot delete.");
  //     return; 
  //   }

  //   if (confirm(`are you sure you want to delete "${task.title}"?`)) {
  //     this.taskService.deleteTask(task.id!).subscribe({ // task.id! confirms it's not null
  //       next: () => {
  //         console.log(`✅ task deleted: ${task.title}`);
  //         this.allTasks = this.allTasks.filter(t => t.id !== task.id);
  //         this.applyFilters();
  //       },
  //       error: (err) => console.error("❌ error deleting task:", err),
  //     });
  //   }
  // }
  

  applyFilters(): void {
    let filteredTasks = [...this.allTasks];

    // apply filtering
    if (this.selectedFilter !== 'all') {
      filteredTasks = filteredTasks.filter(
        (task) => this.getPriorityLabel(task.priority) === this.selectedFilter
      );
    }

    // apply priority sorting (only if all is selected)
    if (this.selectedFilter === 'all') {
      filteredTasks.sort((a, b) => 
        this.isPriorityAscending ? a.priority - b.priority : b.priority - a.priority
      );
    }

    // filter out completed tasks
    if (!this.showCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // // PENDING: implement user settings
    // // HEY! limit the number of tasks
    //   const maxTasks = this.userSettings.maxTasks || 10; // default to 23
    //   if (filteredTasks.length > maxTasks) {
    //     console.warn("it looks like you've got enough already, take it easy");
    //     filteredTasks = filteredTasks.slice(0, maxTasks);
    //   }

    // apply "show top 3 tasks" filter
    this.tasks = this.showTopTasks ? filteredTasks.slice(0, 3) : filteredTasks;
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
    const updatedTask = { ...task, completed: !task.completed };

    // console.log("🟡 sending toggled task:", updatedTask); 
  
    this.taskService.toggleTaskCompletion(updatedTask).subscribe({
      next: (taskUpdated) => {
        // console.log("✅ task toggled:", taskUpdated);

        this.allTasks = this.allTasks.map(t => t.id === taskUpdated.id ? taskUpdated : t);
        this.applyFilters();
      },
      error: (err) => console.error("❌ error toggling task:", err),
    });
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

  // closeModal(): void {
  //   this.showModal = false;
    
  //   this.newTaskTitle = "";
  //   this.newTaskDescription = "";
  //   this.newTaskPriority = 3;

  //   this.titleError = "";
  //   this.descriptionError = "";
  //   this.isFormValid = false;
  
  //   // setTimeout(() => {}, 10);
  // }

  closeModal(): void {
    if (this.newTaskTitle || this.newTaskDescription) {
      this.showDiscardModal = true; // 🚀 Trigger discard confirmation modal
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

        this.closeModal();
      },
      error: (err) => console.error("❌ error creating task:", err),
    });
  }  


}

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
  // currentPage: number = 1; // track current page for pagination
  showModal: boolean = false;
  newTaskTitle: string = "";
  newTaskDescription: string = "";
  newTaskPriority: number = 3; // default priority (pipeline)

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

  // -------------------- modal starts here
  openNewTaskModal(): void {
    this.showModal = true; // just opens the modal
  }

  closeModal(): void {
    this.showModal = false;
    
    // ✅ Ensure input fields are reset
    this.newTaskTitle = "";
    this.newTaskDescription = "";
    this.newTaskPriority = 3;
  
    // ✅ Force UI refresh (triggers change detection)
    setTimeout(() => {}, 10);
  }

  createTask(task: Task): void {
    this.taskService.createTask(task).subscribe({
      next: (createdTask) => {
        this.allTasks.push(createdTask);
        this.applyFilters();
        console.log("task created:", createdTask);
      },
      error: (err) => console.error("error creating task:", err),
    });
  }

  saveTask(): void {
    if (!this.newTaskTitle.trim()) {
      console.error("❌ Title cannot be empty!");
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
  
    console.log("📤 Sending task to backend:", newTask); // ✅ Log before sending
  
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        console.log("✅ Task successfully created:", createdTask);
  
        // ✅ Ensure the task appears in the list immediately
        this.allTasks = [...this.allTasks, createdTask]; // Create new array to trigger change detection
        this.applyFilters(); // Reapply filters to refresh UI
  
        // ✅ Close the modal AFTER updating UI
        this.closeModal();
      },
      error: (err) => console.error("❌ Error creating task:", err),
    });
  }  


}

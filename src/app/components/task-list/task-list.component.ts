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
  tasks: Task[] = []; // current tasks
  allTasks: Task[] = []; // store full list to reset filtering
  isPriorityAscending: boolean = true; // priority sort order
  isDateAscending: boolean = true; // date sort order
  selectedFilter: string = 'all'; // active filter
  showTopTasks: boolean = false; // slider for "show only 3 tasks"
  // currentPage: number = 1; // track current page for pagination

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
}

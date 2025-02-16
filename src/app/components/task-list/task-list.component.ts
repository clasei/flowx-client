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
  tasks: Task[] = []; // store feched tasks
  allTasks: Task[] = []; // store all tasks to reset filtering
  isAscending: boolean = true; // sort order
  selectedFilter: string = 'all';

  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // this.tasks = tasks;
        this.allTasks = tasks; // store all tasks to reset filtering
        // this.tasks = tasks.sort((a, b) => a.priority - b.priority); // sort tasks by priority
        this.tasks = [...this.allTasks].sort((a, b) => a.priority - b.priority);
        console.log('Tasks loaded:', tasks);
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.tasks.reverse();
  }


  getPriorityLabel(priority: number): string {
    const labels: Record<number, string> = { 1: "critical", 2: "focus", 3: "pipeline" };
    return labels[priority] || "queue"; // default to queue if not found
  }

  filterTasks(event: Event) {
    const selectedFilter = (event.target as HTMLSelectElement).value;
  
    // full list first
    if (selectedFilter === "all") {
      this.tasks = [...this.allTasks];
  
      // reset sorting to default (priority ascending)
      this.isAscending = true;
      this.tasks.sort((a, b) => a.priority - b.priority);
    } else {
      this.tasks = this.allTasks.filter(
        (task) => this.getPriorityLabel(task.priority) === selectedFilter
      );
    }
  
    // // make the sort order consistent
    // if (!this.isAscending) {
    //   this.tasks.reverse();
    // }

    // disable sorting when a filter is applied
    this.isAscending = false;
  }

}

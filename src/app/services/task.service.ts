import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  // private baseUrl = 'http://localhost:8080/tasks';
  private baseUrl = `${environment.apiUrl}/tasks`; 

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  /** ✅ GET all tasks */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}`, this.getAuthHeaders());
  }

  /** ✅ GET a task by ID */
  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${taskId}`, this.getAuthHeaders());
  }

  /** ✅ POST - Create a new task */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}`, task, this.getAuthHeaders());
  }

  /** ✅ PUT - Update task */
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${task.task_id}`, task, this.getAuthHeaders());
  }

  /** ✅ PUT - Toggle task completion */
  toggleTaskCompletion(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${task.task_id}/toggle`, {}, this.getAuthHeaders());
  }

  /** ✅ DELETE - Remove a task */
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}`, this.getAuthHeaders());
  }

  /** ✅ DELETE - Remove all completed tasks */
  deleteAllDoneTasks(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/completed`, this.getAuthHeaders());
  }


  // -------------- filtering & sorting --------------
  filterAndSortTasks(
    tasks: Task[],
    selectedFilter: string,
    showCompleted: boolean,
    isPriorityAscending: boolean,
    showTopTasks: boolean
  ): Task[] {
    let filteredTasks = [...tasks];

    // priority filter
    if (selectedFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => this.getPriorityLabel(task.priority) === selectedFilter);
    }

    // sort by priority
    if (selectedFilter === 'all') {
      filteredTasks.sort((a, b) => isPriorityAscending ? a.priority - b.priority : b.priority - a.priority);
    }

    // filter out completed tasks
    if (!showCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    // "show top 3 tasks" filter
    return showTopTasks ? filteredTasks.slice(0, 3) : filteredTasks;
  }

  getPriorityLabel(priority: number): string {
    const labels: Record<number, string> = { 1: "critical", 2: "focus", 3: "pipeline" };
    return labels[priority] || "queue";
  }

  getRepeatIntervalText(days: number): string {
    if (!days) return ''; // handle null or undefined
    const intervals: { [key: number]: string } = {
      1: 'day',
      7: 'week',
      14: '2 weeks',
      21: '3 weeks',
      30: 'month',
      90: 'quarter',
      365: 'year',
    };
    return intervals[days] || `${days} days`;
  }

}

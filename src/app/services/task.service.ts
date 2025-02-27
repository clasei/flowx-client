import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  // fetch all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl); // return the array of tasks
  }

  // create new task
  createTask(task: Task): Observable<Task> {
    console.log("new task to backend:", task);
    return this.http.post<Task>(this.apiUrl, task);
  }

  // toggle comlpetion status

  toggleTaskCompletion(task: Task): Observable<Task> {
    console.log("toggled task to backend:", task);
    return this.http.put<Task>(`${this.apiUrl}/${task.id}/toggle`, {}); 
  }

  // toggleTaskCompletion(task: Task): Observable<Task> {
  //   task.completed = !task.completed;
  //   task.updatedAt = new Date();
  
  //   if (task.repeating && task.completed) {
  //     task.nextRepeatDate = this.calculateNextRepeatDate(task.repeatInterval || 1);
  //   } else {
  //     task.nextRepeatDate = null as any;
  //   }
  
  //   return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  // }


  // delete a task
  deleteTask(id: number): Observable<void> {
    console.log("🔴 deleting task from backend, ID:", id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // update a task
  updateTask(task: Task): Observable<Task> {
    console.log("📝 updating task:", task);
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  // delete all tasks
  deleteAllDoneTasks(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/completed`);
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

  // -------------- repetitive tasks --------------

  // getRepeatIntervalText(days: number): string {
  //   const options: { [key: number]: string } = {
  //     1: "every day",
  //     7: "every week",
  //     14: "every 2 weeks",
  //     21: "every 3 weeks",
  //     30: "every month",
  //     90: "every quarter",
  //     365: "every year",
  //   };
  
  //   return options[days] || `every ${days} days`;
  // }

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
  
  calculateNextRepeatDate(days: number): Date {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }
  

}

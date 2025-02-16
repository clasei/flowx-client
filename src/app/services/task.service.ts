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

  // delete a task
  deleteTask(id: number): Observable<void> {
    console.log("🔴 deleting task from backend, ID:", id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

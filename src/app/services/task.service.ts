import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
// export class TaskService {
//   private apiUrl = 'http://localhost:8080/tasks';

//   constructor(private http: HttpClient) {}

//   // fetch all tasks
//   getTasks(): Observable<Task[]> {
//     return this.http.get<{ content: Task[] }>(this.apiUrl).pipe(
//       map(response => response.content) // extract the content -- array of tasks
//     );
//   }
// }
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';
  private http = inject(HttpClient); // ⬅️ Injecting HttpClient instead of constructor injection

  getTasks(): Observable<Task[]> {
    return this.http.get<{ content: Task[] }>(this.apiUrl).pipe(
      map(response => response.content)
    );
  }
}
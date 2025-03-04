import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/auth';

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  // signup(email: string, password: string, username: string): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { email, password, username }).pipe(
  //     tap(response => {
  //       if (response.token) {
  //         localStorage.setItem('authToken', response.token); // store token
  //       }
  //     })
  //   );
  // }

  signup(email: string, password: string, username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { email, password, username }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('username', username); // store username
        }
      })
    );
  }
  
  

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

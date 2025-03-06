import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private http = inject(HttpClient);
  constructor(private http: HttpClient) {} // CHANGED to normal constructor for testing

  private baseUrl = 'http://localhost:8080/auth';

  // Track authentication state (true = logged in, false = logged out)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // ---------------------------------------
  
  // login(email: string, password: string): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
  //     tap(response => {
  //       if (response.token) {
  //         localStorage.setItem('authToken', response.token);
  //         this.isAuthenticatedSubject.next(true); // Notify components that user is logged in
  //       }
  //     })
  //   );
  // }

  // signup(email: string, password: string, username: string): Observable<AuthResponse> {
  //   return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { email, password, username }).pipe(
  //     tap(response => {
  //       if (response.token) {
  //         localStorage.setItem('authToken', response.token);
  //         localStorage.setItem('username', username);
  //         this.isAuthenticatedSubject.next(true);
  //       }
  //     })
  //   );
  // }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("❌ Full error response:", error);
        return throwError(() => this.extractErrorMessage(error)); 
      })
    );
  }
  
  signup(email: string, password: string, username: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, { email, password, username }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('username', username);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("❌ Full error response:", error);
        return throwError(() => this.extractErrorMessage(error)); 
      })
    );
  }
  
  // ✅ Extract error messages from backend response
  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 400 && error.error) {
      // If backend sends multiple validation errors as an object
      if (typeof error.error === 'object' && !Array.isArray(error.error)) {
        return Object.values(error.error).join(' | '); // Joins all messages into one string
      }
      return error.error.message || "sign up failed..";
    }
    if (error.status === 401) {
      return "something is not right above, just re-think and try again";
    }
    return "something went wrong, try again";
  }
  

  

  // ---------------------------------------

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false); // Notify components that user is logged out
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }  

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }
}




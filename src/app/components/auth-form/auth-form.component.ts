import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = "email and password are required";
      return;
    }
  
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/flowxboard']),
      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = err; // receives a clean error message
      }
    });
  }
  

}

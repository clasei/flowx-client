import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  // password = '';
  password: string = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // login() {
  //   this.authService.login(this.email, this.password).subscribe({
  //     next: () => this.router.navigate(['/flowxboard']),
  //     error: (err) => this.errorMessage = err.error.message || 'Login failed'
  //   });
  // }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('✅ Login successful! Redirecting to /flowxboard');
        this.router.navigate(['/flowxboard']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
        console.error('❌ Login error:', err);
      }
    });
  }
}

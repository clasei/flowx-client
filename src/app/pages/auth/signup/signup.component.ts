import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  // password: string = '';
  username = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.authService.signup(this.email, this.password, this.username).subscribe({
      next: () => this.router.navigate(['/flowxboard']), // redirect after signup
      error: (err) => this.errorMessage = err.error.message || 'Signup failed'
    });
  }
  

  // signup() {
  //   this.authService.signup(this.email, this.password, this.username).subscribe({
  //     next: () => this.router.navigate(['/dashboard']),
  //     error: (err) => {
  //       console.error("Signup error:", err); // ✅ Debugging line
  //       this.errorMessage = err.error?.message || 'Signup failed'; // ✅ Safer error handling
  //     }
  //   });
  // }
  
}

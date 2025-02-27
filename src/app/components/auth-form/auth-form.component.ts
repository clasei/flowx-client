import { Component } from '@angular/core';
import { AuthWrapperService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent {
  constructor(private authService: AuthWrapperService) {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}

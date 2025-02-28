import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthWrapperService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, CommonModule]
})
// export class NavbarComponent { 

//   constructor(private router: Router) {}

//   menuOpen = false;

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }
// }

export class NavbarComponent { 
  authService = inject(AuthWrapperService);
  constructor(private router: Router) {}

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    let isLoggedIn = false;
    this.authService.isAuthenticated().subscribe(isAuth => isLoggedIn = isAuth);
    return isLoggedIn;
  }
}

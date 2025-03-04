// import { Component, inject } from '@angular/core';
// import { RouterModule, Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss',
//   imports: [RouterModule, CommonModule]
// })

// export class HomeComponent { 
//   authService = inject(AuthService);

//   constructor(private router: Router) {}

//   isLoggedIn(): boolean {
//     return this.authService.isLoggedIn();
//   }

//   goToDashboard() {
//     if (this.isLoggedIn()) {
//       this.router.navigate(['/flowxboard']);
//     } else {
//       this.router.navigate(['/login']);
//     }
//   }
// }

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [RouterModule, CommonModule]
})
export class HomeComponent { }

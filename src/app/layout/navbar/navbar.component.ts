import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
// import { AuthWrapperService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule]
})
export class NavbarComponent { 

  constructor(private router: Router) {}

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
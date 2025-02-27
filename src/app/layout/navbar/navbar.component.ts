import { Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule]
})
export class NavbarComponent { 
  
  route = inject(ActivatedRoute);

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
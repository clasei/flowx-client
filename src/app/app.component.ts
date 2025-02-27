import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { CommonModule } from '@angular/common'; // needed for ngIf, ngFor --> standalone apps
import { AuthModule } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent, AuthModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flowx-client';
}
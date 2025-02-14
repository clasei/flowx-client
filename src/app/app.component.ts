import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // provides routing functionalities + RouterOutlet directive
import { NavbarComponent } from "./layout/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flowx-client';
}
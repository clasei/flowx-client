import { Component } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  // imports: [],
  imports: [TaskListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

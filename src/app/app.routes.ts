import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent },
  // more routes here
];

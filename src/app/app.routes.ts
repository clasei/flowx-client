import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DoneTasksComponent } from './pages/done-tasks/done-tasks.component';
import { DeletedTasksComponent } from './pages/deleted-tasks/deleted-tasks.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // landing page -- public
  { path: 'login', component: LoginComponent }, // login page
  { path: 'taskboard', component: DashboardComponent }, // main page after login
  { path: 'settings', component: SettingsComponent }, // settings
  { path: 'done', component: DoneTasksComponent }, // completed Tasks
  { path: 'deleted', component: DeletedTasksComponent }, // deleted tasks
  { path: '**', redirectTo: '' } // redirect unknown routes
];

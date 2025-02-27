import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DoneTasksComponent } from './pages/done-tasks/done-tasks.component';
import { DeletedTasksComponent } from './pages/deleted-tasks/deleted-tasks.component';
// import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  // { path: '', component: HomeComponent }, // landing page -- public
  { path: '', redirectTo: 'flowxboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // login page
  { path: 'flowxboard', component: DashboardComponent }, // main page after login
  { path: 'settings', component: SettingsComponent }, // settings
  { path: 'done', component: DoneTasksComponent }, // completed Tasks
  { path: 'deleted', component: DeletedTasksComponent }, // deleted tasks
  { path: '**', redirectTo: '' } // redirect unknown routes
];

// export const routes: Routes = [
//   { path: '', redirectTo: 'flowxboard', pathMatch: 'full' }, // ✅ Redirect root to dashboard
//   { path: 'login', component: LoginComponent }, 
//   { path: 'flowxboard', component: DashboardComponent, canActivate: [AuthGuard] }, // ✅ Protect route
//   { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
//   { path: 'done', component: DoneTasksComponent, canActivate: [AuthGuard] },
//   { path: 'deleted', component: DeletedTasksComponent, canActivate: [AuthGuard] },
//   { path: '**', redirectTo: '' } // ✅ Catch-all redirect
// ];
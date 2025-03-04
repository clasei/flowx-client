import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DoneTasksComponent } from './pages/done-tasks/done-tasks.component';
import { DeletedTasksComponent } from './pages/deleted-tasks/deleted-tasks.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  // { path: '', redirectTo: 'flowxboard', pathMatch: 'full' }, // Redirect root to dashboard
  // { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home page
  // { path: 'home', component: HomeComponent }, // Home page
  { path: '', component: HomeComponent }, // Home page
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'signup', component: SignupComponent }, // Signup page
  { path: 'flowxboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protected dashboard
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] }, // Protected settings
  { path: 'done', component: DoneTasksComponent, canActivate: [AuthGuard] }, // Protected completed tasks
  { path: 'deleted', component: DeletedTasksComponent, canActivate: [AuthGuard] }, // Protected deleted tasks
  { path: '**', redirectTo: 'login' } // Redirect unknown routes to login
];

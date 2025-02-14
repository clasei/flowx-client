import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // provides routing functionalities + RouterOutlet directive
import { TasksModule } from './tasks/tasks.module';
import { routes } from './app.routes';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), 
    TasksModule // includes task related components
  ],
  providers: [],
})
export class AppModule { }
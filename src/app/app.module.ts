import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // provides routing functionalities + RouterOutlet directive
import { routes } from './app.routes';
import { TasksModule } from './tasks/tasks.module';

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

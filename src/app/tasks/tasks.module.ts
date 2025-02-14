import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../components/task-item/task-item.component';
import { TaskListComponent } from '../components/task-list/task-list.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    TaskItemComponent,
    TaskListComponent
  ],
  exports: [
    // TaskItemComponent, // no needed if only used in task-list
    TaskListComponent
  ]
})
export class TasksModule { }
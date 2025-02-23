import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneTasksListComponent } from './done-tasks-list.component';

describe('DoneTasksListComponent', () => {
  let component: DoneTasksListComponent;
  let fixture: ComponentFixture<DoneTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneTasksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

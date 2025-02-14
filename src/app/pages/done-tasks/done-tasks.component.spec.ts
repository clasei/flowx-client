import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneTasksComponent } from './done-tasks.component';

describe('DoneTasksComponent', () => {
  let component: DoneTasksComponent;
  let fixture: ComponentFixture<DoneTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

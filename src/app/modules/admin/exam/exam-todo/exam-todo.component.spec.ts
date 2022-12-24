import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTodoComponent } from './exam-todo.component';

describe('ExamTodoComponent', () => {
  let component: ExamTodoComponent;
  let fixture: ComponentFixture<ExamTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

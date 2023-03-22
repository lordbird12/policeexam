import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCorrectAnswerComponent } from './dialog-correct-answer.component';

describe('DialogCorrectAnswerComponent', () => {
  let component: DialogCorrectAnswerComponent;
  let fixture: ComponentFixture<DialogCorrectAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCorrectAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCorrectAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

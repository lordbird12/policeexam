import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegiterDialogComponent } from './regiter-dialog.component';

describe('RegiterDialogComponent', () => {
  let component: RegiterDialogComponent;
  let fixture: ComponentFixture<RegiterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegiterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegiterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

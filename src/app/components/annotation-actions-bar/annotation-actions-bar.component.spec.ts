import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationActionsBarComponent } from './annotation-actions-bar.component';

describe('AnnotationActionsBarComponent', () => {
  let component: AnnotationActionsBarComponent;
  let fixture: ComponentFixture<AnnotationActionsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotationActionsBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationActionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

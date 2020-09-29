import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationThreadListComponent } from './annotation-thread-list.component';

describe('AnnotationThreadListComponent', () => {
  let component: AnnotationThreadListComponent;
  let fixture: ComponentFixture<AnnotationThreadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotationThreadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationThreadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

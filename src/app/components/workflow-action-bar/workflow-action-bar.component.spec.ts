import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowActionBarComponent } from './workflow-action-bar.component';

describe('WorkflowActionBarComponent', () => {
  let component: WorkflowActionBarComponent;
  let fixture: ComponentFixture<WorkflowActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowActionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

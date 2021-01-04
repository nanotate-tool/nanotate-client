import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsFilterFormComponent } from './stats-filter-form.component';

describe('StatsFilterFormComponent', () => {
  let component: StatsFilterFormComponent;
  let fixture: ComponentFixture<StatsFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsFilterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

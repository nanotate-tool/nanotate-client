import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsForGenericComponent } from './stats-for-generic.component';

describe('StatsForTagsComponent', () => {
  let component: StatsForGenericComponent;
  let fixture: ComponentFixture<StatsForGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsForGenericComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsForGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

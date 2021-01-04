import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsForNanopubsComponent } from './stats-for-nanopubs.component';

describe('StatsForNanopubsComponent', () => {
  let component: StatsForNanopubsComponent;
  let fixture: ComponentFixture<StatsForNanopubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsForNanopubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsForNanopubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

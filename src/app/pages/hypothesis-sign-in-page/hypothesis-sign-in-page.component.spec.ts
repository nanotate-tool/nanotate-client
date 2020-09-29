import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothesisSignInPageComponent } from './hypothesis-sign-in-page.component';

describe('HypothesisSignInPageComponent', () => {
  let component: HypothesisSignInPageComponent;
  let fixture: ComponentFixture<HypothesisSignInPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HypothesisSignInPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothesisSignInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

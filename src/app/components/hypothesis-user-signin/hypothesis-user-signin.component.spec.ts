import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothesisUserSigninComponent } from './hypothesis-user-signin.component';

describe('HypothesisUserSigninComponent', () => {
  let component: HypothesisUserSigninComponent;
  let fixture: ComponentFixture<HypothesisUserSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HypothesisUserSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothesisUserSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HypothesisSessionGuard } from './hypothesis-session.guard';

describe('HypothesisSessionGuard', () => {
  let guard: HypothesisSessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HypothesisSessionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

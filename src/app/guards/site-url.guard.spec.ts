import { TestBed } from '@angular/core/testing';

import { SiteUrlGuard } from './site-url.guard';

describe('SiteUrlGuard', () => {
  let guard: SiteUrlGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SiteUrlGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

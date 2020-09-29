import { TestBed } from '@angular/core/testing';

import { HypothesisService } from './hypothesis.service';

describe('HypothesisService', () => {
  let service: HypothesisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HypothesisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NanopubsService } from './nanopubs.service';

describe('NanopubsService', () => {
  let service: NanopubsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NanopubsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AttestationDataService } from './attestation-data.service';

describe('AttestationDataService', () => {
  let service: AttestationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttestationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

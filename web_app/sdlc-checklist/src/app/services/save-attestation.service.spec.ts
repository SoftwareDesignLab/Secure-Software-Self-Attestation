import { TestBed } from '@angular/core/testing';

import { SaveAttestationService } from './save-attestation.service';

describe('SaveAttestationService', () => {
  let service: SaveAttestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveAttestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { notifyService } from './notify.service';

describe('notifyService', () => {
  let service: notifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(notifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AssessmentPlanService } from './assessment-plan.service';

describe('data store and retrieval', () => {
  let service: AssessmentPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentPlanService]
    });
    service = TestBed.inject(AssessmentPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with two blank parties', () => {
    service.getData().subscribe(data => {
      expect(data.metadata.parties.length).toEqual(2);
    });
  });
});
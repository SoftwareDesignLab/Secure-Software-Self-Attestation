import { TestBed } from '@angular/core/testing';

import { AssessmentPlanService } from './assessment-plan.service';

describe('AssessmentPlanService', () => {
  let service: AssessmentPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

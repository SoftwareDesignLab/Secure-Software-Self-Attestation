/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { TestBed } from '@angular/core/testing';

import { AttestationDataService } from './attestation-data.service';
import { AssessmentPlanService } from './assessment-plan.service';

describe('AttestationDataService', () => {
  let attestationService: AttestationDataService;
  let mockAPService: Partial<AssessmentPlanService>; 
  const UID = '1-test-subject'

  mockAPService = {
    setAttestationType(value){},
    addAssessmentPlan(value){},
    addCatalog(value){},
    setAttestationFocus(value){},
    removeCatalog(value){},
    setControlSelection(value){},
    setControlComment(value){},
    removeControlComment(value){}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AssessmentPlanService, useValue: mockAPService}
      ],
    });
    attestationService = TestBed.inject(AttestationDataService);
    attestationService.addform();
    attestationService.setView(0);
  });

  it('should be created', () => {
    expect(attestationService).toBeTruthy();
  });

  it('set up control Selection', () => {
    attestationService.setUpControl(UID);
    attestationService.updateControlSelection(UID,'check');
    let subject = attestationService.setUpControl(UID);
    expect(subject?.selection).toEqual('check');
  });

  it('set control comment to done', () => {
    attestationService.setUpControl(UID);
    attestationService.finalizeControlComment(UID,"comment");
    let subject = attestationService.setUpControl(UID);
    expect(subject?.finalized).toEqual(true);
    expect(subject?.comment).toEqual("comment");
  });

  it('set control comment to saved', () => {
    attestationService.setUpControl(UID);
    attestationService.saveControlComment(UID,'comment');
    let subject = attestationService.setUpControl(UID);
    expect(subject?.comment).toEqual('comment');
    expect(subject?.finalized).toEqual(false);
  });

  it('delete control comment', () => {
    attestationService.setUpControl(UID);
    attestationService.finalizeControlComment(UID,"comment");
    attestationService.deleteControlComment(UID);
    let subject = attestationService.setUpControl(UID);
    expect(subject?.comment).toEqual('');
    expect(subject?.finalized).toEqual(false);
  });

  it('fully set up control then delete it', () => {
    attestationService.setDeletionPosition(0);
    attestationService.setUpControl(UID);
    attestationService.updateControlSelection(UID,'check');
    attestationService.finalizeControlComment(UID,"comment");
    attestationService.toggleControlRollable(UID);
    attestationService.removeControl('test-subject');
    let subject = attestationService.setUpControl(UID);
    
    expect(subject?.comment).toEqual('');
    expect(subject?.finalized).toEqual(false);
    expect(subject?.selection).toEqual('no-selection');
    expect(subject?.showRollable).toEqual(false);
  });

  

  it('toggle group rollable', () => {
    attestationService.setUpGroup(UID);
    let subject = attestationService.setUpGroup(UID);
    attestationService.toggleGroupRollable(UID);
    expect(subject?.showRollable).toEqual(false);
   });


 
 

});

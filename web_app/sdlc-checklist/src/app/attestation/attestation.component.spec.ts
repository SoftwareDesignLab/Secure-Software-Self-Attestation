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
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationComponent } from './attestation.component';
import { AttestationDataService } from '../services/attestation-data.service';
import { AssessmentPlanService } from '../services/assessment-plan.service';
import { attestationComment } from '../models/attestationForm';

import catalog from '../defaultCatalog';



describe('AttestationComponent', () => {
  let mockAPService: Partial<AssessmentPlanService>; 
  let attestationService: AttestationDataService;
  let Attestation: AttestationComponent;
  let fixture: ComponentFixture<AttestationComponent>;



  beforeEach(async () => {

    mockAPService = {
      setAttestationType(value){},
      addAssessmentPlan(value){},
      addCatalog(value){},
      setAttestationFocus(value){},
      removeCatalog(value){},
      setControlSelection(value){}
    };
   

    await TestBed.configureTestingModule({
      declarations: [ 
        AttestationComponent,
      ],
      providers: [
        attestationComment,
        AttestationDataService,
        {provide: Boolean, useValue: true },
        {provide: AssessmentPlanService, useValue: mockAPService}
                  

      ],
    })
    .compileComponents();

    attestationService = TestBed.inject(AttestationDataService);
    attestationService.addform();
    attestationService.setView(0);    
    
    fixture = TestBed.createComponent(AttestationComponent);
    Attestation = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(Attestation).toBeTruthy();
  });

  it('Attestation Comment should have multiple rows', () => {
    Attestation.addRow();
    Attestation.addRow();
    expect(Attestation.getInfo.length).toEqual(3);
  });

  it('Restore Default Catalog', () => {
    Attestation.removeCatalog("d152b49c-39b4-4765-a961-75051dcf2293");
    Attestation.restoreDefaultCatalog()
    expect(Attestation.getCatalogs.catalogs[0].uuid).toEqual("d152b49c-39b4-4765-a961-75051dcf2293")
  });


  it('Default Name', () => {
    Attestation.setPositionTag(7);
    expect(Attestation.getName()).toEqual("Attestation Form 7");
  });

  it('Check if Submittable', () => {
    Attestation.setAttestationType('multiple');
    Attestation.addRow();
    Attestation.getInfo[0].addName("Carlos");
    Attestation.getInfo[0].addVersion("1.9");
    Attestation.getInfo[0].addDate("12/08/2022");
    expect(Attestation.getInfo[0].getDate()).toEqual("12/08/2022");
    expect(Attestation.getInfo[0].getVersion()).toEqual("1.9");
    expect(Attestation.getInfo[0].getName()).toEqual("Carlos");
    expect(Attestation.submitable()).toEqual(true);
  });








  




});

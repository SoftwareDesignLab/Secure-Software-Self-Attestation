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

import { ChecklistItemComponent } from './control.component';
import { AttestationDataService } from '../services/attestation-data.service';
import { AssessmentPlanService } from '../services/assessment-plan.service';
import { FormStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ChecklistItemComponent', () => {
  let control: ChecklistItemComponent;
  let fixture: ComponentFixture<ChecklistItemComponent>;
  let attestationDataService: AttestationDataService;
  let mockAPService: Partial<AssessmentPlanService>; 



  beforeEach(async () => {


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

    await TestBed.configureTestingModule({
      declarations: [ ChecklistItemComponent],
      providers: [
        {provide: AssessmentPlanService, useValue: mockAPService}
      ],
      imports: [
        FormsModule
      ]
    })
    .compileComponents();


    attestationDataService = TestBed.inject(AttestationDataService);
    attestationDataService.addform();
    attestationDataService.setView(0);

    
    fixture = TestBed.createComponent(ChecklistItemComponent);
    control = fixture.componentInstance;
    fixture.detectChanges();



    control.UID = "1-d152b49c-39b4-4765-a961-75051dcf2293-subject";
    control.catalogUUID = "d152b49c-39b4-4765-a961-75051dcf2293";
    control.id = "subject";

  });

  it('should create', () => {
    expect(control).toBeTruthy();
  });

  it('unselect control', () => {
    control.changeSelection("check");
    control.changeSelection("check");
    expect(control.isChecked()).toEqual(false);
  });

  it('is checked', () => {
    control.select("check");
    expect(control.isChecked()).toEqual(true);
  });

  it('Deploy and cancel', () => {
    control.deploy();
    control.cancel();
    expect(control.popup).toEqual(false);
    expect(control.primed).toEqual(false);
    expect(control.focused).toEqual(false);
  });

  it('Comment Focus', () => {
    control.focused = false;
    control.commentFocus();
    expect(control.focused).toEqual(true);
  });


  it('Delete Comment', () => {
    control.comment = "123";
    control.done();
    control.del()
    expect(control.comment).toEqual("");
    expect(control.finalized).toEqual(false);
  });


  it('enter', () => {
    control.onPopup=false;
    control.enter(true);
    expect(control.onPopup).toEqual(true);
  });

  it('down then up', () => {
    control.down();
    control.up();
    expect(control.popup).toEqual(false);
    expect(control.primed).toEqual(false);
    expect(control.focused).toEqual(false);
  });


  it('get undefines about control with no information', () => {
    expect(control.getDescription()).toEqual(undefined);
    expect(control.getReferences()).toEqual(undefined);
    expect(control.getExamples()).toEqual(undefined);
  });

  it('updates control when page swaps', () => {
    attestationDataService.setUpControl(control.UID);
    attestationDataService.updateControlSelection(control.UID,"select");
    attestationDataService.finalizeControlComment(control.UID,"final");
    control.refresh(); 
    expect(control.selection).toEqual("select");
    expect(control.finalized).toEqual(true);
    expect(control.comment).toEqual("final");
  });


  it('Save Control Comment', () => {
    control.finalized=true;
    control.save();
    expect(control.finalized).toEqual(false);
  });

  it('toggle control information', () => {
    let before = control.showRollable;
    control.toggleRollable();
    expect(control.showRollable).toEqual(!before);
   
  });


  // Does not fully work due to missing methods of parts/props
  it('Shows all extra information', () => {
    control.parts = {
      Example: "Example"
    }
    control.props = {
      Reference: "Reference",
      Description: "Description",
    }
    control.parts.Example = "Example";
    control.props.Reference = "Reference";
    control.props.Description = "Description";
    expect(control.getReferences()).toEqual("Reference");
    expect(control.getDescription()).toEqual("Description");
    expect(control.getExamples()).toEqual("Example");
  });









});

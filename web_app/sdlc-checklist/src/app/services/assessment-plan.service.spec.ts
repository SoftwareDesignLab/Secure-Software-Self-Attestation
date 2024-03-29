/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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

import { AssessmentPlanService, ControlSelectionType } from './assessment-plan.service';
import { AttestationDataService } from './attestation-data.service';

import { Prop } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import catalog from '../defaultCatalog';

describe('data store and retrieval', () => {
  let APService: AssessmentPlanService;
  let attestationService: AttestationDataService;
  const producerInfo = {
    name: 'Producer',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postal: '12345',
    country: 'USA',
    website: 'https://producer.com',
  }
  const contactInfo = {
    fname: 'John',
    lname: 'Doe',
    title: 'CEO',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postal: '12345',
    country: 'USA',
    phone: '123-456-7890',
    email: 'eee@maail.com'
  }
  const defaultCatalog = catalog as Catalog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentPlanService, AttestationDataService]
    });
    APService = TestBed.inject(AssessmentPlanService);
    attestationService = TestBed.inject(AttestationDataService);

    attestationService.setView(0);
  });

  it('should be created', () => {
    expect(APService).toBeTruthy();
  });

  it('should initialize with two blank parties', () => {
    APService.getMetadata().subscribe(metadata => {
      expect(metadata.parties.length).toEqual(2);
      expect(metadata.parties[0].type).toEqual("organization");
      expect(metadata.parties[1].type).toEqual("person");
    });
  });

  it('should update producer information accordingly', () => {
    APService.updateProducerInfo(producerInfo);
    APService.getMetadata().subscribe(metadata => {
      expect(metadata.parties.length).toEqual(2);
      expect(metadata.parties[0].name).toEqual(producerInfo.name);
      expect(metadata.parties[0].addresses?.length).toEqual(1);
      expect(metadata.parties[0].props?.length).toEqual(1);
    });
  });

  it('adds a catalog to the data store', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'].length).toEqual(1);
      expect(plan['reviewed-controls']['control-selections'][0].props?.length).toEqual(2);
    });
  });

  it('removes a catalog from the data store', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.addCatalog(defaultCatalog);
    APService.addCatalog(defaultCatalog);
    APService.removeCatalog(defaultCatalog.uuid);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'].length).toEqual(2);
    });
  });

  it('sets the selection for a control', () => {
    const controlID = "4e(i)(A)";
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.setControlSelection(controlID, ControlSelectionType.yes,0);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'][0].props).toContain(new Prop(controlID, 'yes', "Compliance Claim"));
    });
  });

  it('removes the selection for a control and ensures no duplicates', () => {
    const controlID = "4e(i)(A)";
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.setControlSelection(controlID, ControlSelectionType.yes,0);
    APService.setControlSelection(controlID, ControlSelectionType.yes,0);
    APService.setControlComment(controlID, "commmmmmmmmmmment",0);
    APService.setControlComment(controlID, "commmmmmmmmmmment",0);
    APService.setControlComment(controlID, "commmmmmmmmmmment",0);
    APService.setControlSelection(controlID, ControlSelectionType.noSelection,0);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'][0].props?.length).toEqual(3);
    }
    );
  });

  it('sets the comment for a control', () => {
    const controlID = "4e(i)(A)";
    const comment = "This is a comment";
    APService.addAssessmentPlan("Test Assessment Plan");
    APService.addCatalog(defaultCatalog);
    APService.setControlComment(controlID, comment,0);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'][0].props).toContain(new Prop(controlID, comment, "Attestation Claim"));
    });
  });

  it('removes the comment for a control', () => {
    const controlID = "4e(i)(A)";
    const comment = "This is a comment";
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.setControlComment(controlID, comment,0);
    APService.removeControlComment(controlID,0);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'][0].props?.length).toEqual(2);
    });
  });

  it('adds an assesssment subject', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addSubject("name", "version", "date");
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['assessment-subjects']?.length).toEqual(1);
      expect(plan['assessment-subjects']?.[0]['include-subjects']?.length).toEqual(1);
      expect(plan['assessment-subjects']?.[0]['include-subjects']?.[0].props?.length).toEqual(3);
    });
  });

  it('removes an assesssment subject', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addSubject("name", "version", "date");
    APService.addSubject("name", "version", "date");
    APService.addSubject("name", "version", "date");
    APService.popSubject();
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['assessment-subjects']?.[0]['include-subjects']?.length).toEqual(2);
    });
  });
  
  it('updates an assesssment subject', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addSubject("name", "version", "date");
    APService.addSubject("name", "version", "date");
    APService.addSubject("name", "version", "date");
    APService.updateSubject(1, "updated", "version", "date");
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['assessment-subjects']?.[0]['include-subjects']?.[1].props).toContain(new Prop("Product Name", "updated", "Product Info"));
    });
  });

  it('generates a valid assessment plan', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.updateProducerInfo(producerInfo);
    APService.updateContactInfo(contactInfo);
    APService.addCatalog(defaultCatalog);
    APService.addSubject("name", "version", "date");
    APService.addSubject("name2", "version2", "date2");
    APService.setControlSelection("4e(i)(A)", ControlSelectionType.yes,0);
    APService.setControlComment("4e(i)(A)", "comment",0);
    APService.setControlSelection("4e(i)(B)", ControlSelectionType.no,0);
    APService.setControlComment("4e(i)(B)", "bad",0);
    APService.setAttestationType("Company-wide")
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      console.log(JSON.stringify(plan.serialize(), null, 4));
      expect(plan.serialize()).toBeTruthy();
    });
  });
});
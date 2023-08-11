import { TestBed } from '@angular/core/testing';

import { AssessmentPlanService, ControlSelectionType } from './assessment-plan.service';
import { AttestationDataService } from './attestation-data.service';

import { Prop } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import catalog from '../defaultCatalog';
import { AppComponent } from '../app.component';
import { ApplicationInitStatus } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';

describe('Assessment Plan data and retrieval', () => {
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
    APService.setControlSelection("4e(i)(A)", "check",0);
    APService.setControlComment("4e(i)(A)", "comment",0);
    APService.setControlSelection("4e(i)(B)", "x",0);
    APService.setControlComment("4e(i)(B)", "bad",0);
    APService.setAttestationType("Company-wide")
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      console.log(JSON.stringify(plan.serialize(), null, 4));
      expect(plan.serialize()).toBeTruthy();
    });
  });


  it('deletes all information associated with a control ID', () => {
    APService.addAssessmentPlan("Test Assessment Plan")
    APService.addCatalog(defaultCatalog);
    APService.setControlSelection("4e(i)(A)", "check",0);
    APService.setControlComment("4e(i)(A)", "comment",0);
    APService.deleteControl("4e(i)(A)",0);
    APService.getAssessmentPlans().subscribe(data => {
      let plan = data[0];
      expect(plan['reviewed-controls']['control-selections'][0].props?.length).toEqual(2);
      expect(plan['reviewed-controls']['control-selections'][0]['include-controls']?.length).toEqual(undefined);

      });

    });


    it('test all control-selection types', () => {
      APService.addAssessmentPlan("Test Assessment Plan")
      APService.addCatalog(defaultCatalog);
      APService.setControlSelection("4e(i)(A)", "check",0);
      APService.setControlSelection("4e(i)(B)", "x",0);
      APService.setControlSelection("4e(i)(C)", "na",0);
      APService.setControlSelection("4e(i)(D)", "no-selection",0);
      APService.getAssessmentPlans().subscribe(data => {
        let plan = data[0];
        expect(plan['reviewed-controls']['control-selections'][0].props).toContain(new Prop("4e(i)(A)", "yes", "Compliance Claim"));
        expect(plan['reviewed-controls']['control-selections'][0].props).toContain(new Prop("4e(i)(B)", "no", "Compliance Claim"));
        expect(plan['reviewed-controls']['control-selections'][0].props).toContain(new Prop("4e(i)(C)", "n/a", "Compliance Claim"));
        expect(plan['reviewed-controls']['control-selections'][0].props).not.toContain(new Prop("4e(i)(D)", "no-selection", "Compliance Claim"));
        });
      });


      it('Update Assessment Name', () => {
        APService.addAssessmentPlan()
        APService.addCatalog(defaultCatalog);
        APService.updateAssessmentPlanName("Test Assessment Plan");
        APService.getAssessmentPlans().subscribe(data => {
          let plan = data[0];
          expect(plan.metadata.title).toEqual("Test Assessment Plan");
          });
        });

        it('Serializing every plan and catalog', () => {
          APService.addAssessmentPlan("Test Assessment Plan")
          APService.updateProducerInfo(producerInfo);
          APService.updateContactInfo(contactInfo);
          APService.addCatalog(defaultCatalog);
          APService.addSubject("name", "version", "date");
          APService.addSubject("name2", "version2", "date2");
          APService.setControlSelection("4e(i)(A)", "check",0);
          APService.setControlComment("4e(i)(A)", "comment",0);
          APService.setControlSelection("4e(i)(B)", "x",0);
          APService.setControlComment("4e(i)(B)", "bad",0);
          APService.setAttestationType("Company-wide")
          APService.getAssessmentPlans().subscribe(data => {
            expect(APService.serializePlan(0)).toBeTruthy();
            expect(APService.serializeCurrentPlan()).toBeTruthy();
            expect(APService.serializeAll()).toBeTruthy();
            expect(APService.serializeCurrentCatalogs()).toBeTruthy();
          });
        });


        it('testing out include All', () => {
          APService.addAssessmentPlan("Test Assessment Plan");
          APService.updateProducerInfo(producerInfo);
          APService.updateContactInfo(contactInfo);
          APService.addCatalog(defaultCatalog);
          APService.setControlSelection("4e(i)(A)", "no-selection",0);
          APService.setControlSelection("4e(i)(B)", "no-selection",0);
          APService.setControlSelection("4e(i)(C)", "no-selection",0);

          APService.setControlSelection("4e(i)(A)", "check",0);
          APService.setControlSelection("4e(i)(B)", "check",0);
          APService.setControlSelection("4e(i)(C)", "check",0);
          APService.getAssessmentPlans().subscribe(data => {
            let plan = data[0];
            expect(plan['reviewed-controls']['control-selections'][0]['include-all']).toEqual(true);
          });
        });


        it('Removing Assessment Plans that do not exist', () => {
          APService.getAssessmentPlans().subscribe(data => {
            expect(APService.removeAssessmentPlan(-1)).toEqual();
            expect(APService.removeAssessmentPlan(7)).toEqual();
          });
        });
  
});



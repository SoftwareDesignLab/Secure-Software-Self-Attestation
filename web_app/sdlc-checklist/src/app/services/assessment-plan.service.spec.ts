import { TestBed } from '@angular/core/testing';

import { AssessmentPlanService, ControlSelectionType } from './assessment-plan.service';

import { Prop } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import catalog from '../defaultCatalog';

describe('data store and retrieval', () => {
  let service: AssessmentPlanService;
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
      expect(data.metadata.parties[0].type).toEqual("organization");
      expect(data.metadata.parties[1].type).toEqual("person");
    });
  });

  it('should update producer information accordingly', () => {
    service.updateProducerInfo(producerInfo);
    service.getData().subscribe(data => {
      expect(data.metadata.parties.length).toEqual(2);
      expect(data.metadata.parties[0].name).toEqual(producerInfo.name);
      expect(data.metadata.parties[0].addresses?.length).toEqual(1)
      expect(data.metadata.parties[0].props?.length).toEqual(1);
    });
  });

  it('adds a catalog to the data store', () => {
    service.addCatalog(defaultCatalog);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'].length).toEqual(1);
      expect(data['reviewed-controls']['control-selections'][0].props?.length).toEqual(2);
    });
  });

  it('removes a catalog from the data store', () => {
    service.addCatalog(defaultCatalog);
    service.addCatalog(defaultCatalog);
    service.addCatalog(defaultCatalog);
    service.removeCatalog(defaultCatalog.uuid);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'].length).toEqual(2);
    });
  });

  it('sets the selection for a control', () => {
    const controlID = "4e(i)(A)";
    service.addCatalog(defaultCatalog);
    service.setControlSelection(controlID, ControlSelectionType.yes);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'][0].props).toContain(new Prop(controlID, 'yes', "Compliance Claim"));
    });
  });

  it('removes the selection for a control and ensures no duplicates', () => {
    const controlID = "4e(i)(A)";
    service.addCatalog(defaultCatalog);
    service.setControlSelection(controlID, ControlSelectionType.yes);
    service.setControlSelection(controlID, ControlSelectionType.yes);
    service.setControlSelection(controlID, ControlSelectionType.yes);
    service.setControlComment(controlID, "commmmmmmmmmmment");
    service.setControlComment(controlID, "commmmmmmmmmmment");
    service.setControlComment(controlID, "commmmmmmmmmmment");
    service.removeControlSelection(controlID);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'][0].props?.length).toEqual(3);
    }
    );
  });

  it('sets the comment for a control', () => {
    const controlID = "4e(i)(A)";
    const comment = "This is a comment";
    service.addCatalog(defaultCatalog);
    service.setControlComment(controlID, comment);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'][0].props).toContain(new Prop(controlID, comment, "Attestation Claim"));
    });
  });

  it('removes the comment for a control', () => {
    const controlID = "4e(i)(A)";
    const comment = "This is a comment";
    service.addCatalog(defaultCatalog);
    service.setControlComment(controlID, comment);
    service.removeControlComment(controlID);
    service.getData().subscribe(data => {
      expect(data['reviewed-controls']['control-selections'][0].props?.length).toEqual(2);
    });
  });

  it('adds an assesssment subject', () => {
    service.addSubject("name", "version", "date");
    service.getData().subscribe(data => {
      expect(data['assessment-subjects']?.length).toEqual(1);
      expect(data['assessment-subjects']?.[0]['include-subjects']?.length).toEqual(1);
      expect(data['assessment-subjects']?.[0]['include-subjects']?.[0].props?.length).toEqual(3);
    });
  });

  it('removes an assesssment subject', () => {
    service.addSubject("name", "version", "date");
    service.addSubject("name", "version", "date");
    service.addSubject("name", "version", "date");
    service.popSubject();
    service.getData().subscribe(data => {
      expect(data['assessment-subjects']?.[0]['include-subjects']?.length).toEqual(2);
    });
  });
  
  it('updates an assesssment subject', () => {
    service.addSubject("name", "version", "date");
    service.addSubject("name", "version", "date");
    service.addSubject("name", "version", "date");
    service.updateSubject(1, "updated", "version", "date");
    service.getData().subscribe(data => {
      expect(data['assessment-subjects']?.[0]['include-subjects']?.[1].props).toContain(new Prop("Product Name", "updated", "Product Info"));
    });
  });

  it('generates a valid assessment plan', () => {
    service.updateProducerInfo(producerInfo);
    service.updateContactInfo(contactInfo);
    service.addCatalog(defaultCatalog);
    service.addSubject("name", "version", "date");
    service.addSubject("name2", "version2", "date2");
    service.setControlSelection("4e(i)(A)", ControlSelectionType.yes);
    service.setControlComment("4e(i)(A)", "comment");
    service.setControlSelection("4e(i)(B)", ControlSelectionType.no);
    service.setControlComment("4e(i)(B)", "bad");
    service.setCompanyWide()
    service.getData().subscribe(data => {
      console.log(JSON.stringify(data.serialize(), null, 4));
      expect(data.serialize()).toBeTruthy();
    });
  });
});
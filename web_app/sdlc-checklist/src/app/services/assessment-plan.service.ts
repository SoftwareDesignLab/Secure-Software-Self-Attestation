import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AssessmentPlan, APMetadata, ControlSelection, SubjectID, Prop } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import { AttestationDataService } from './attestation-data.service';

export enum ControlSelectionType {
  yes = "yes",
  no = "no",
  notApplicable = "n/a",
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  private metadata = new BehaviorSubject<APMetadata>(new APMetadata());
  currentMetadata = this.metadata.asObservable();
  private assessmentPlans = new BehaviorSubject<Array<AssessmentPlan>>(new Array<AssessmentPlan>());
  currentPlans = this.assessmentPlans.asObservable();
  private catalogs = new BehaviorSubject<Array<Catalog>>(new Array<Catalog>());
  currentCatalogs = this.catalogs.asObservable();
  // A map of control IDs to the index of their catalogs in both the assessment plan control-selections and the catalog list
  private controlMap = new BehaviorSubject<Map<string, number>>(new Map<string, number>());
  currentControlMap = this.controlMap.asObservable();

  private attestationFocus = new BehaviorSubject<number>(0);
  currentViewState = this.attestationFocus.asObservable();

  constructor() {
    let metadata = this.metadata.getValue();
    metadata.addBlankParty();
    metadata.addBlankParty();
    metadata.parties[0].type = "organization";
    metadata.parties[1].type = "person";
    this.metadata.next(metadata);
  }

  getMetadata() {
    return this.metadata.asObservable();
  }

  getAssessmentPlans() {
    return this.assessmentPlans.asObservable();
  }

  setAttestationFocus(index: number) {
    this.attestationFocus.next(index);
  }

  serializeAll() {
    let plans = this.assessmentPlans.getValue();
    return JSON.stringify(plans.map(plan => plan.serialize()));
  }

  serializePlan(index: number) {
    let plans = this.assessmentPlans.getValue();
    return JSON.stringify(plans[index].serialize());
  }

  serializeCurrentPlan() {
    let plans = this.assessmentPlans.getValue();
    return JSON.stringify(plans[this.attestationFocus.getValue()].serialize());
  }

  updateProducerInfo(data: any) {
    let metadata = this.metadata.getValue();
    let plans = this.assessmentPlans.getValue();
    
    if (data.name) metadata.parties[0].name = data.name;
    //TODO update for multiple address lines
    if (data.address) metadata.parties[0].setPrimaryAddressLines([data.address]);
    if (data.city) metadata.parties[0].setPrimaryCity(data.city);
    if (data.state) metadata.parties[0].setPrimaryState(data.state);
    if (data.country) metadata.parties[0].setPrimaryCountry(data.country);
    if (data.postal) metadata.parties[0].setPrimaryPostalCode(data.postal);
    if (data.website) {
      metadata.parties[0].addLink(data.website, "website");
      metadata.parties[0].addProp("webiste", data.website, "Producer Info");
    }

    plans.forEach(plan => {
      plan.metadata.parties = metadata.parties;
      plan.metadata['last-modified'] = new Date().toISOString();
    });

    this.assessmentPlans.next(plans);
    this.metadata.next(metadata);
  }
  
  updateContactInfo(data: any) {
    let metadata = this.metadata.getValue();
    let plans = this.assessmentPlans.getValue();
    let name = metadata.parties[1].name || " ";

    if (data.fname) data.name = data.fname + " " + name.split(" ")[1];
    if (data.lname) data.name = name.split(" ")[0] + " " + data.lname;
    if (data.title) metadata.parties[1].addProp("title", data.title, "Contact Info");
    //TODO update for multiple address lines
    if (data.address) metadata.parties[1].setPrimaryAddressLines([data.address]);
    if (data.city) metadata.parties[1].setPrimaryCity(data.city);
    if (data.state) metadata.parties[1].setPrimaryState(data.state);
    if (data.country) metadata.parties[1].setPrimaryCountry(data.country);
    if (data.postal) metadata.parties[1].setPrimaryPostalCode(data.postal);
    if (data.phone) metadata.parties[1]["telephone-numbers"] = [data.phone];
    if (data.email) metadata.parties[1]["email-addresses"] = [data.email];

    plans.forEach(plan => {
      plan.metadata.parties = metadata.parties;
      plan.metadata['last-modified'] = new Date().toISOString();
    });

    this.assessmentPlans.next(plans);
    this.metadata.next(metadata);
  }

  addAssessmentPlan(title: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = new AssessmentPlan();
    let metadata = this.metadata.getValue();
    
    metadata.title = title;
    plan.metadata = metadata;
    plan.uuid = uuid();
    plan.addAssessmentSubject();

    plans.push(plan);
    this.assessmentPlans.next(plans);
  }

  removeAssessmentPlan(index: number) {
    let plans = this.assessmentPlans.getValue();
    
    if (index >= plans.length) return;
    if (index < 0) return;

    plans.splice(index, 1);
    
    this.assessmentPlans.next(plans);
  }

  addCatalog(catalog: Catalog) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();
    let controlSelection = new ControlSelection();

    // TODO add links
    
    // add catalog info
    controlSelection.addProp("Catalog ID", catalog.uuid, "catalog");
    controlSelection.addProp("Catalog Name", catalog.metadata.title, "catalog");
    plan['reviewed-controls']['control-selections'].push(controlSelection);
    
    //cache index of catalog for each control
    let controlMap = this.controlMap.getValue();
    if (catalog.controls !== undefined){
      catalog.controls.forEach( control => {
        controlMap.set(control.id, plan['reviewed-controls']['control-selections'].length-1);
      });
    }
    if (catalog.groups !== undefined){
      catalog.groups.forEach( group => {
        if (group.controls === undefined) group.controls = [];
        group.controls.forEach( control => {
          controlMap.set(control.id, plan['reviewed-controls']['control-selections'].length-1);
        });
      });
    }

    catalogs.push(catalog);
    this.catalogs.next(catalogs);
    this.controlMap.next(controlMap);
    this.assessmentPlans.next(plans);
  }

  removeCatalog(catalogUuid: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();
    let controlMap = this.controlMap.getValue();

    let index = catalogs.findIndex( catalog => catalog.uuid === catalogUuid);
    if (index > -1) {
      catalogs.splice(index, 1);
      this.catalogs.next(catalogs);
      // remove catalog info
      plan['reviewed-controls']['control-selections'].splice(index, 1);
      // remove cached index of catalog for each control
      controlMap.forEach( (value, key) => {
        if (value === index) {
          controlMap.delete(key);
        }
        if (value > index) {
          controlMap.set(key, value-1);
        }
      });
      this.controlMap.next(controlMap);
      this.assessmentPlans.next(plans);
    }
  }

  // // control selections list is indexed by attestation. it should match up with assessment-subjects list

  setControlSelection(controlID: string, selection: ControlSelectionType | string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      if (typeof selection === "string") {
        switch (selection) {
          case "check": selection = ControlSelectionType.yes; break;
          case "x": selection = ControlSelectionType.no; break;
          case "na": selection = ControlSelectionType.notApplicable; break;
          case "no-selection": this.removeControlSelection(controlID); return;
          default: return console.log("Invalid selection type. Must be one of 'check', 'x', or 'na'");
        }
      }

      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, selection, "Compliance Claim");
      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  setControlComment(controlID: string, comment: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, comment, "Attestation Claim");
      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  removeControlSelection(controlID: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  removeControlComment(controlID: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  addSubject(productName: string, version: string, date: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject creation");
      return;
    }

    if (plan["assessment-subjects"][0]["include-subjects"] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"] = [];
    }

    let subject = new SubjectID();
    subject.addProp("Product Name", productName, "Product Info");
    subject.addProp("Version", version, "Product Info");
    subject.addProp("Date", date, "Product Info");

    plan["assessment-subjects"][0]["include-subjects"].push(subject);
    plan["assessment-subjects"][0].props = [new Prop("type", "multi product", "Attestation Type")];

    this.assessmentPlans.next(plans);
  }

  updateSubject(subjectIndex: number, productName: string, version: string, date: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject update");
      return;
    }

    if (plan["assessment-subjects"][0]["include-subjects"] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"] = [];
    }

    let subject = new SubjectID();
    subject.addProp("Product Name", productName, "Product Info");
    subject.addProp("Version", version, "Product Info");
    subject.addProp("Date", date, "Product Info");

    plan["assessment-subjects"][0]["include-subjects"][subjectIndex] = subject;

    this.assessmentPlans.next(plans);
  }

  popSubject() {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject deletion");
      return;
    }

    if (plan["assessment-subjects"][0]["include-subjects"] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"] = [];
    }

    plan["assessment-subjects"][0]["include-subjects"].pop();
    plan["assessment-subjects"][0].props = [new Prop("type", "multi product", "Attestation Type")];

    this.assessmentPlans.next(plans);
  }

  setCompanyWide() {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject update");
      return;
    }
    
    plan["assessment-subjects"][0].includeAll(true)
    plan["assessment-subjects"][0].props = [new Prop("type", "company-wide", "Attestation Type")];

    this.assessmentPlans.next(plans);
  }

  setSingleProduct() {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject update");
      return;
    }

    plan["assessment-subjects"][0].includeAll(false)
    if (plan["assessment-subjects"][0]["include-subjects"] !== undefined) {
      while (plan["assessment-subjects"][0]["include-subjects"].length > 1) {
        plan["assessment-subjects"][0]["include-subjects"].pop();
      }
    }

    plan["assessment-subjects"][0].props = [new Prop("type", "single product", "Attestation Type")];
    this.assessmentPlans.next(plans);
  }
  //TODO set attestation type on radio button change

  //TODO exclude subjects
  //TODO automatically exclude subjects that are unchecked
}
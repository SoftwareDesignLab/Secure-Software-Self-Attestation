import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AssessmentPlan, APMetadata, ControlSelection, SubjectID, Prop, AssessmentSubject } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import { GroupComponent } from '../group/group.component';
import { ChecklistItemComponent } from '../control/control.component';

export enum ControlSelectionType {
  yes = "yes",
  no = "no",
  notApplicable = "n/a",
  noSelection = "no-selection"
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  private metadata = new BehaviorSubject<APMetadata>(new APMetadata());
  currentMetadata = this.metadata.asObservable();
  private assessmentPlans = new BehaviorSubject<Array<AssessmentPlan>>(new Array<AssessmentPlan>());
  currentPlans = this.assessmentPlans.asObservable();
  private catalogs = new BehaviorSubject<Array<Array<Catalog>>>(new Array<Array<Catalog>>([]));
  currentCatalogs = this.catalogs.asObservable();

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
    console.log(index);
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
    if (data.fname) {
      data.name = data.fname + " " + name.split(" ")[1];
      metadata.parties[1].setName(data.name);
    }
    if (data.lname){
      data.name = name.split(" ")[0] + " " + data.lname;
      metadata.parties[1].setName(data.name);
    }
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
    let catalogs = this.catalogs.getValue();

    metadata.title = title;
    plan.metadata = metadata;
    plan.uuid = uuid();
    plan.addAssessmentSubject();

    console.log("Adding plan: " + title)

    plans.push(plan);
    catalogs.push([]);
    this.assessmentPlans.next(plans);
  }

  removeAssessmentPlan(index: number) {
    let plans = this.assessmentPlans.getValue();

    if (index >= plans.length) return;
    if (index < 0) return;

    plans.splice(index, 1);

    this.assessmentPlans.next(plans);
  }

  updateAssessmentPlanName(name: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()];

    plan.metadata.title = name;
    plan.metadata['last-modified'] = new Date().toISOString();

    plans[this.attestationFocus.getValue()] = plan;
    this.assessmentPlans.next(plans);
  }

  addCatalog(catalog: Catalog) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();
    let controlSelection = new ControlSelection();

    catalogs[this.attestationFocus.getValue()].push(catalog);
    this.catalogs.next(catalogs);

    // TODO add links
    
    // add catalog info
    controlSelection.addProp("Catalog ID", catalog.uuid, "catalog");
    controlSelection.addProp("Catalog Name", catalog.metadata.title, "catalog");
    plan['reviewed-controls']['control-selections'].push(controlSelection);

    plan.metadata['last-modified'] = new Date().toISOString();
    
    this.assessmentPlans.next(plans);
  }

  removeCatalog(catalogUuid: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();

    let index = catalogs[this.attestationFocus.getValue()].findIndex( catalog => catalog.uuid === catalogUuid);
    if (index > -1) {
      catalogs.splice(index, 1);
      // remove catalog info
      plan['reviewed-controls']['control-selections'].splice(index, 1);
      
      plan.metadata['last-modified'] = new Date().toISOString();
      
      this.catalogs.next(catalogs);
      this.assessmentPlans.next(plans);
    }
  }

  // // control selections list is indexed by attestation. it should match up with assessment-subjects list

  setControlSelection(controlID: string, selection: ControlSelectionType | string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();

    let index = catalogs[this.attestationFocus.getValue()].findIndex( catalog => this._recursiveContainsControl(controlID, catalog.controls, catalog.groups));
    if (index !== undefined) {
      if (typeof selection === "string") {
        switch (selection) {
          case "check": selection = ControlSelectionType.yes; break;
          case "x": selection = ControlSelectionType.no; break;
          case "na": selection = ControlSelectionType.notApplicable; break;
          case "no-selection": selection = ControlSelectionType.noSelection; break;
          default: return console.log("Invalid selection type. Must be one of 'check', 'x', or 'na'");
        }
      }

      console.log("Setting control selection: " + controlID + " to " + selection)

      if (selection == ControlSelectionType.noSelection) {
        plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
        
        plan['reviewed-controls']['control-selections'][index].addExcludeControl(controlID);
        plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
        plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
        plan.metadata['last-modified'] = new Date().toISOString();
        this.assessmentPlans.next(plans);
        return;
      }
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, selection, "Compliance Claim");

      if(selection != ControlSelectionType.notApplicable){
        plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
        plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      }


      plan.metadata['last-modified'] = new Date().toISOString();

      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  // controls can contain other controls and groups can contain controls
  // this function will recursively search to see if a control is a child of a group or control
  _recursiveContainsControl(controlID: string, controls?: ChecklistItemComponent[], groups?: GroupComponent[]): boolean { // First, check in the list of ChecklistItemComponents
    for (let item of (controls || [])) {
      if (item.id === controlID) {
        return true;
      }
      // If the item has nested controls, search within them
      if (item.controls) {
        if (this._recursiveContainsControl(controlID, item.controls)) {
          return true;
        }
      }
    }

    // Then, check in the list of GroupComponents
    for (let group of groups || []) {
      // If the group has nested controls, search within them
      if (group.controls) {
        if (this._recursiveContainsControl(controlID, group.controls)) {
          return true;
        }
      }
      // If the group has nested groups, search within them
      if (group.groups) {
        if (this._recursiveContainsControl(controlID, [], group.groups)) {
          return true;
        }
      }
    }

    // If no match is found, return false
    return false;
   }


  

  setControlComment(controlID: string, comment: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    let catalogs = this.catalogs.getValue();
    let index: number | undefined = undefined;

    //TODO definitely optimize this
    index = catalogs[this.attestationFocus.getValue()].findIndex( catalog => this._recursiveContainsControl(controlID, catalog.controls, catalog.groups));

    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, comment, "Attestation Claim");

      plan.metadata['last-modified'] = new Date().toISOString();

      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  removeControlComment(controlID: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    let catalogs = this.catalogs.getValue();

    let index = catalogs[this.attestationFocus.getValue()].findIndex( catalog => this._recursiveContainsControl(controlID, catalog.controls, catalog.groups));
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== -1) {
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
  
      plan.metadata['last-modified'] = new Date().toISOString();

      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  addSubject(productName: string, version: string, date: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      plan["assessment-subjects"] = [new AssessmentSubject()];
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

    plan.metadata['last-modified'] = new Date().toISOString();

    this.assessmentPlans.next(plans);
  }

  updateSubject(subjectIndex: number, productName?: string, version?: string, date?: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject update");
      return;
    }

    if (plan["assessment-subjects"][0]["include-subjects"] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"] = [];
    }
    
    if (plan["assessment-subjects"][0]["include-subjects"][subjectIndex] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"].push(new SubjectID());
    }

    let subject = plan["assessment-subjects"][0]["include-subjects"][subjectIndex];
    if (productName !== undefined) {
      subject.removeProp("Product Name");
      subject.addProp("Product Name", productName, "Product Info");
    }
    if (version !== undefined) {
      subject.removeProp("Version");
      subject.addProp("Version", version, "Product Info");
    }
    if (date !== undefined) {
      subject.removeProp("Date");
      //TODO convert date to isoformat
      subject.addProp("Date", date, "Product Info");
    }

    plan.metadata['last-modified'] = new Date().toISOString();

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

    plan.metadata['last-modified'] = new Date().toISOString();

    this.assessmentPlans.next(plans);
  }

  setAttestationType(type: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (plan["assessment-subjects"] === undefined) {
      plan["assessment-subjects"] = [new AssessmentSubject()];
    }
    
    if (type === "company") {
      plan["assessment-subjects"][0].includeAll(true)
    } else {
      plan["assessment-subjects"][0].includeAll(false)
    }
    plan["assessment-subjects"][0].props = [new Prop("type", type, "Attestation Type")];

    plan.metadata['last-modified'] = new Date().toISOString();

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

    plan.metadata['last-modified'] = new Date().toISOString();

    this.assessmentPlans.next(plans);
  }
  //TODO automatically exclude subjects that are unchecked
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssessmentPlan, ControlSelection, SubjectID } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';

export enum ControlSelectionType {
  yes = "yes",
  no = "no",
  notApplicable = "n/a",
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  private assessmentPlan = new BehaviorSubject<AssessmentPlan>(new AssessmentPlan());
  currentPlan = this.assessmentPlan.asObservable();
  private catalogs = new BehaviorSubject<Array<Catalog>>(new Array<Catalog>());
  currentCatalogs = this.catalogs.asObservable();
  // A map of control IDs to the index of their catalogs in both the assessment plan control-selections and the catalog list
  private controlMap = new BehaviorSubject<Map<String, number>>(new Map<String, number>());
  currentControlMap = this.controlMap.asObservable();

  constructor() {
    let plan = this.assessmentPlan.getValue();
    plan.metadata.addBlankParty();
    plan.metadata.addBlankParty();
    plan.metadata.parties[0].type = "organization";
    plan.metadata.parties[1].type = "person";
    plan.addAssessmentSubject();
    this.assessmentPlan.next(plan);
  }

  getData() {
    return this.assessmentPlan.asObservable();
  }

  updateProducerInfo(data: any) {
    let plan = this.assessmentPlan.getValue();
    
    if (data.name) plan.metadata.parties[0].name = data.name;
    //TODO update for multiple address lines
    if (data.address) plan.metadata.parties[0].setPrimaryAddressLines([data.address]);
    if (data.city) plan.metadata.parties[0].setPrimaryCity(data.city);
    if (data.state) plan.metadata.parties[0].setPrimaryState(data.state);
    if (data.country) plan.metadata.parties[0].setPrimaryCountry(data.country);
    if (data.postal) plan.metadata.parties[0].setPrimaryPostalCode(data.postal);
    if (data.website) plan.metadata.parties[0].addLink(data.website, "website");
    if (data.website) plan.metadata.parties[0].addProp("webiste", data.website, "Producer Info");

    this.assessmentPlan.next(plan);
  }
  
  updateContactInfo(data: any) {
    let plan = this.assessmentPlan.getValue();
    let name = plan.metadata.parties[1].name || " ";

    if (data.fname) data.name = data.fname + " " + name.split(" ")[1];
    if (data.lname) data.name = name.split(" ")[0] + " " + data.lname;
    if (data.title) plan.metadata.parties[1].addProp("title", data.title, "Contact Info");
    //TODO update for multiple address lines
    if (data.address) plan.metadata.parties[1].setPrimaryAddressLines([data.address]);
    if (data.city) plan.metadata.parties[1].setPrimaryCity(data.city);
    if (data.state) plan.metadata.parties[1].setPrimaryState(data.state);
    if (data.country) plan.metadata.parties[1].setPrimaryCountry(data.country);
    if (data.postal) plan.metadata.parties[1].setPrimaryPostalCode(data.postal);
    if (data.phone) plan.metadata.parties[1]["telephone-numbers"] = [data.phone];
    if (data.email) plan.metadata.parties[1]["email-addresses"] = [data.email];

    this.assessmentPlan.next(plan);
  }

  addCatalog( catalog: Catalog) {
    let plan = this.assessmentPlan.getValue();
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
    this.assessmentPlan.next(plan);
  }

  removeCatalog(catalogUuid: String) {
    let plan = this.assessmentPlan.getValue();
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
      this.assessmentPlan.next(plan);
    }
  }

  // // control selections list is indexed by attestation. it should match up with assessment-subjects list

  setControlSelection(controlID: string, selection: ControlSelectionType) {
    let plan = this.assessmentPlan.getValue();
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== undefined) {
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, selection, "Compliance Claim");
      this.assessmentPlan.next(plan);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  setControlComment(controlID: string, comment: string) {
    let plan = this.assessmentPlan.getValue();
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== undefined) {
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, comment, "Attestation Claim");
      this.assessmentPlan.next(plan);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  removeControlSelection(controlID: string) {
    let plan = this.assessmentPlan.getValue();
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== undefined) {
      plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].addExcludeControl(controlID);
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      this.assessmentPlan.next(plan);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  removeControlComment(controlID: string) {
    let plan = this.assessmentPlan.getValue();
    let controlMap = this.controlMap.getValue();
    let index = controlMap.get(controlID);
    if (index === undefined) {
      index = plan['reviewed-controls']['control-selections'].findIndex( control => control.props?.find( prop => prop.name === controlID) !== undefined);
    }
    if (index !== undefined) {
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
      this.assessmentPlan.next(plan);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  addSubject(productName: String, version: String, date: String) {
    let plan = this.assessmentPlan.getValue();

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

    this.assessmentPlan.next(plan);
  }

  updateSubject(subjectIndex: number, productName: String, version: String, date: String) {
    let plan = this.assessmentPlan.getValue();

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

    this.assessmentPlan.next(plan);
  }

  popSubject() {
    let plan = this.assessmentPlan.getValue();

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject deletion");
      return;
    }

    if (plan["assessment-subjects"][0]["include-subjects"] === undefined) {
      plan["assessment-subjects"][0]["include-subjects"] = [];
    }

    plan["assessment-subjects"][0]["include-subjects"].pop();

    this.assessmentPlan.next(plan);
  }

  setCompanyWide(value: Boolean) {
    let plan = this.assessmentPlan.getValue();

    if (plan["assessment-subjects"] === undefined) {
      console.log("assessment-subjects not found in plan, skipping subject update");
      return;
    }
    
    plan["assessment-subjects"][0].includeAll(value)

    this.assessmentPlan.next(plan);
  }

  //TODO exclude subjects
  //TODO automatically exclude subjects that are unchecked
}
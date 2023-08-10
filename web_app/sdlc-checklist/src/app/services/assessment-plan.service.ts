import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AssessmentPlan, APMetadata, ControlSelection, SubjectID, Prop, AssessmentSubject } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';

export enum ControlSelectionType {
  yes = "yes",
  no = "no",
  notApplicable = "n/a",
  noSelection = "no-selection",
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
  public modifiedControlIds: Map<number, Map<String, Map<String, String>>> = new Map<number, Map<String, Map<String, String>>>();

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

  getActivePlan() {
    return this.assessmentPlans.getValue()[this.attestationFocus.getValue()]
  }

  setAttestationFocus(index: number) {
    this.attestationFocus.next(index);
  }

  serializeAll(asObject: boolean = false) {
    let plans = this.assessmentPlans.getValue();
    const serialized = plans.map(plan => plan.serialize());
    return asObject ? serialized : JSON.stringify(plans.map(plan => plan.serialize()));
  }

  serializePlan(index: number, asObject: boolean = false) {
    let plans = this.assessmentPlans.getValue();
    const serialized = plans[index].serialize();
    return asObject ? serialized : JSON.stringify(serialized);
  }

  serializeCurrentPlan(asObject: boolean = false) {
    return this.serializePlan(this.attestationFocus.getValue(), asObject);
  }

  serializeCurrentCatalogs(asObject: boolean = false) {
    let catalogs = this.catalogs.getValue();
    let serialized = catalogs[this.attestationFocus.getValue()].map(catalog => catalog as object);
    return asObject ? serialized : JSON.stringify(serialized);
  }

  updateProducerInfo(data: any) {
    let metadata = this.metadata.getValue();
    let plans = this.assessmentPlans.getValue();
    
    if (data.name) metadata.parties[0].name = data.name;
    //TODO update for multiple address lines
    if (data.address) metadata.parties[0].setPrimaryAddressLines([data.address]);
    if (data.address1) metadata.parties[0].setPrimaryAddressLine1(data.address1);
    if (data.address2) metadata.parties[0].setPrimaryAddressLine2(data.address2);
    if (data.city) metadata.parties[0].setPrimaryCity(data.city);
    if (data.state) metadata.parties[0].setPrimaryState(data.state);
    if (data.country) metadata.parties[0].setPrimaryCountry(data.country);
    if (data.postal) metadata.parties[0].setPrimaryPostalCode(data.postal);
    if (data.website) {
      metadata.parties[0].addLink(data.website, "website");
      metadata.parties[0].addProp("website", data.website, "Producer Info");
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
    if (data.name) metadata.parties[1].setName(data.name);
    if (data.title) metadata.parties[1].addProp("title", data.title, "Contact Info");
    //TODO update for multiple address lines
    if (data.address1) metadata.parties[1].setPrimaryAddressLine1(data.address1);
    if (data.address2) metadata.parties[1].setPrimaryAddressLine2(data.address2);
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

  addAssessmentPlan(title?: string) {
    let plans = this.assessmentPlans.getValue();
    let plan = new AssessmentPlan();
    let metadata = this.metadata.getValue();
    let catalogs = this.catalogs.getValue();

    if(title != undefined){
      metadata.title = title;
      console.log("Adding plan: " + title);
    }
    else {console.log("Adding titleless plan");}
    plan.metadata = metadata;
    plan.uuid = uuid();
    plan.addAssessmentSubject();

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

  /**
   * Deletes info associated with Control
   * @param controlID ID to be deleted 
   * @param index Which catalog in the assessment Plan is this ID located in 
   */
  deleteControl(controlID: string, index: number){
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()];
    plan['reviewed-controls']['control-selections'][index].removeIncludeControl(controlID);
    plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
    plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Attestation Claim");
    plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
    console.log("Deleted: " + controlID);
  }

  /**
   * Finds old id in saved catalogs and changes it to updated catalog.
   * @param oldID ID to be change
   * @param newID What the ID will be changed to
   * @param index Which catalog is being modified in the assessment plan 
   */
  updateCatalogControl(oldID: string, newID: string, index:number){
    let catalogs = this.catalogs.getValue();
    let catalog = catalogs[this.attestationFocus.getValue()][index];
    let path = this.findControlID(catalog,oldID);   // finds path to nested control with ID associated to oldID
    if(path!==null){
      let current: any = catalog;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (current.hasOwnProperty(key)) {
          current = current[key];
        } else {
          console.log('Path not found in the Catalog');
        }
      }
      const destinationKey = path[path.length - 1];
      if (current.hasOwnProperty(destinationKey)) {
        current[destinationKey] = newID;
        console.log("Catalog's control id updated from " + oldID + " to " + newID);
      } else {
        console.log('Path not found in the Catalog');
      }    
    }
    else{
      console.log('Path is not found in the Catalog');
    }
    this.catalogs.next(catalogs);
  }

/**
 * Recursive helper method to find the path of an control Id in a catalog
 * @param catalog catalog object being parsed 
 * @param id control being search for 
 * @param path nested path being generated 
 * @returns returns path if found or null if unable to find ID
 */
  findControlID(catalog: any, id: any, path: string[] = []): string[] | null {
    for (const key in catalog) {
      if (catalog[key] === id) {
        return path.concat(key); // find path to id and returns it
      } else if (Array.isArray(catalog[key]) || typeof catalog[key] === 'object') {
        const nestedPath = this.findControlID(catalog[key], id, path.concat(key));
        if (nestedPath) {
          return nestedPath; 
        }
      }
    }
    return null; // ID not found 
  }

  // control selections list is indexed by attestation. it should match up with assessment-subjects list

  setControlSelection(controlID: string, selection: ControlSelectionType | string, index: number) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]
    if (index !== undefined) {
      if (typeof selection === "string") {
        switch (selection) {
          case "check": case "yes": selection = ControlSelectionType.yes; break;
          case "x": case "no": selection = ControlSelectionType.no; break;
          case "na": case "n/a": selection = ControlSelectionType.notApplicable; break;
          case "no-selection": selection = ControlSelectionType.noSelection; break;
          default: return console.log("Invalid selection type. Must be one of 'check', 'x', or 'na'");
        }
      }

      console.log("Setting control selection: " + controlID + " to " + selection)
      if (selection === ControlSelectionType.noSelection) {
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

      if(selection != ControlSelectionType.noSelection){
        plan['reviewed-controls']['control-selections'][index].removeExcludeControl(controlID);
        plan['reviewed-controls']['control-selections'][index].addIncludeControl(controlID);
      }


      plan.metadata['last-modified'] = new Date().toISOString();

      this.assessmentPlans.next(plans);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }


  

  setControlComment(controlID: string, comment: string, index?: number) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

    if (!index || index === undefined) {
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

  removeControlComment(controlID: string, index: number) {
    let plans = this.assessmentPlans.getValue();
    let plan = plans[this.attestationFocus.getValue()]

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

  findCatalogPosition(formPosition: number, catalogUuid: String): number {
    let catalogs = this.assessmentPlans.getValue()[formPosition]['reviewed-controls']['control-selections']
    for (let i=0, j=catalogs[i].props, k=catalogs.length; i < k; catalogs[++i]) {
      if (j) {
        for (let l=0, m=j[l], n=j.length; l<n; m=j[++l]) {
          if (m.class === "catalog" && m.name === "Catalog ID") {
            if (m.value === catalogUuid) return i;
          }
        }
      }
    }
    return -1;
  }
  //TODO automatically exclude subjects that are unchecked
}
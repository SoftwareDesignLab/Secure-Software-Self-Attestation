import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssessmentPlan, ControlSelection } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  private assessmentPlan = new BehaviorSubject<AssessmentPlan>(new AssessmentPlan());
  currentPlan = this.assessmentPlan.asObservable();
  private controlMap = new BehaviorSubject<Map<String, number>>(new Map<String, number>());
  currentControlMap = this.controlMap.asObservable();
  
  constructor() {
    let plan = this.assessmentPlan.getValue();
    plan.metadata.addBlankParty();
    plan.metadata.addBlankParty();
    this.assessmentPlan.next(plan);
  }

  updateData(data: any) {
    this.assessmentPlan.next(data);
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

    this.assessmentPlan.next(plan);
  }
  
  updateContactInfo(data: any) {
    let plan = this.assessmentPlan.getValue();
    let name = plan.metadata.parties[1].name || " ";

    if (data.fname) data.name = data.fname + " " + name.split(" ")[1];
    if (data.lname) data.name = name.split(" ")[0] + " " + data.lname;
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

  addCatalog(catalog: Catalog) {
    let plan = this.assessmentPlan.getValue();
    let controlSelection = new ControlSelection();
    // TODO add links
    
    // add catalog info
    controlSelection.addProp("Catalog ID", catalog.uuid, "catalog");
    controlSelection.addProp("Catalog Name", catalog.metadata.title, "catalog");
    plan['reviewed-controls']['control-selections'].push(controlSelection);
    
    //cache index of catalog for each control
    let controlMap = this.controlMap.getValue();
    catalog.controls.forEach( control => {
      controlMap.set(control.id, plan['reviewed-controls']['control-selections'].length-1);
    });
    catalog.groups.forEach( group => {
      if (group.controls === undefined) group.controls = [];
      group.controls.forEach( control => {
        controlMap.set(control.id, plan['reviewed-controls']['control-selections'].length-1);
      });
    });
    this.controlMap.next(controlMap);
    this.assessmentPlan.next(plan);
  }

  setControlSelection(controlID: string, selection: string) {
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
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      plan['reviewed-controls']['control-selections'][index].addProp(controlID, comment, "Compliance Claim");
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
      plan['reviewed-controls']['control-selections'][index].removeProp(controlID, "Compliance Claim");
      this.assessmentPlan.next(plan);
      return;
    }
    console.log("Control not found in catalog: " + controlID);
  }

  //TODO add subjects
}
    
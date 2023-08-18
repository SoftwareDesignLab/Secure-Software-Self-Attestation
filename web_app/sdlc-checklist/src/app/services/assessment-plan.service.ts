import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Form } from '../models/attestationModel';
import { ContactService } from './contact.service';
import { AttestationDataService } from './attestation-data.service';

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

  constructor(private contactService: ContactService, private attestationDataService: AttestationDataService) {}

  generateAssessmentPlan(form: Form) {
    let assessmentPlan = form.serialize(form.metadata.serialize(form.name, this.contactService.organization, this.contactService.person));
    let catalogs: any[] = form.catalogDataFiles;
    saveAs(new Blob([JSON.stringify({"assessment-plan": assessmentPlan, catalogs: catalogs})], {type: 'application/json'}), form.name);
  }

  loadFromPlan(plan: any, useContact: boolean = true) {
    let form: Form = this.attestationDataService.createNewForm(false);
    plan.catalogs.forEach((catalog: any) => form.addCatalog(catalog));
    this.attestationDataService.changeAttestation(form, 'attestation');
    form.load(plan["assessment-plan"])
    if (useContact && plan["assessment-plan"]["metadata"]["parties"]) plan["assessment-plan"]["metadata"]["parties"].forEach((party: any) => {
      if (party.type === "organization") this.contactService.organization.load(party);
      if (party.type === "person") this.contactService.person.load(party);
    })
  }

  checkContactConflicts(plan: any): boolean {
    let flag = true
    if (plan["assessment-plan"]["metadata"]["parties"]) plan["assessment-plan"]["metadata"]["parties"].forEach((party: any) => {
      if (party.type === "organization") flag = flag && this.contactService.organization.load(party, false);
      if (party.type === "person") flag = flag && this.contactService.person.load(party, false);
    })
    return flag;
  }
}
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Form } from '../models/attestationModel';
import { ContactService } from './contact.service';
import { AttestationDataService } from './attestation-data.service';
import { Router } from '@angular/router';

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

  constructor(private contactService: ContactService, private attestationDataService: AttestationDataService,
              private router: Router) {}

  generateAssessmentPlan(form: Form) {
    let assessmentPlan = form.serialize(form.metadata.serialize(form.name, this.contactService.organization, this.contactService.person));
    let catalogs: any[] = form.catalogDataFiles;
    saveAs(new Blob([JSON.stringify({"assessment-plan": assessmentPlan, catalogs: catalogs})], {type: 'application/json'}), form.name);
  }

  loadFromPlan(plan: any) {
    let form: Form = this.attestationDataService.createNewForm(false);
    plan.catalogs.forEach((catalog: any) => form.addCatalog(catalog));
    this.router.navigate(['attestation-form']);
    form.load(plan["assessment-plan"])
    if (plan["assessment-plan"]["metadata"]["parties"]) plan["assessment-plan"]["metadata"]["parties"].forEach((party: any) => {
      if (party.type === "organization") this.contactService.organization.load(party);
      if (party.type === "person") this.contactService.person.load(party);
    })
  }
}
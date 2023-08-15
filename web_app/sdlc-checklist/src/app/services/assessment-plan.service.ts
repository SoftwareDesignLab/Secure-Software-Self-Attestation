import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Form } from '../models/attestationModel';
import { ContactService } from './contact.service';

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

  constructor(private contactService: ContactService) {}

  generateAssessmentPlan(form: Form) {
    let assessmentPlan = form.serialize(this.contactService.metadata.serialize(form.name));
    let catalogs: any[] = form.catalogDataFiles;
    saveAs(new Blob([JSON.stringify({"assessment-plan": assessmentPlan, catalogs: catalogs})], {type: 'application/json'}), form.name);
  }
}
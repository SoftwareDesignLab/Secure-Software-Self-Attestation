import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  catalogs: Map<string, any[]> = new Map<string, any[]>();

  generateAssessmentPlan(form: Form) {
    let assessmentPlan = form.serialize(this.contactService.metadata.serialize(form.name));
    let catalogs: any[] = this.catalogs.get(form.uuid) || [];
    saveAs(new Blob([JSON.stringify({assessmentPlan: assessmentPlan, catalogs: catalogs})], {type: 'application/json'}), form.name);
  }
}
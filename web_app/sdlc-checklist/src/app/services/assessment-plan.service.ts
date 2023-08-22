import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Catalog, Control, Form, Group } from '../models/attestationModel';
import { ContactService } from './contact.service';
import { AttestationDataService } from './attestation-data.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {

  constructor(private contactService: ContactService, private attestationDataService: AttestationDataService) {}

  /**
   * Generates a serialized assessment plan of the provided form
   * @param form The form to generate a plan for (defaults to the active form if left blank)
   */
  generateAssessmentPlan(form?: Form) {
    if (form === undefined) {
      form = this.attestationDataService.activeForm;
      if (form === undefined) return;
    }
    let assessmentPlan = form.serialize(form.metadata.serialize(form.name, this.contactService.organization, this.contactService.person));
    let catalogs: any[] = form.catalogDataFiles;
    saveAs(new Blob([JSON.stringify({"assessment-plan": assessmentPlan, catalogs: catalogs})], {type: 'application/json'}), form.name);
  }

  checkInProgressComments(form?: Form): boolean {
    if (form === undefined) {
      form = this.attestationDataService.activeForm;
      if (form === undefined) return true;
    }
    return form.catalogs.find((catalog: Catalog) => {
      return catalog.groups.find((group: Group) => {
        return group.controls.find((control: Control) => {
          if (control.comment !== "" && !control.commentFinalized) return true;
          return false;
        }) !== undefined;
      }) !== undefined;
    }) === undefined;
  }

  /**
   * Loads a serialized json file into a new form
   * @param plan The plan to load
   * @param useContact Whether to use the contact information in the file or just keep the contact as it was (defaults to using the file)
   */
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

  /**
   * Checks if there are any conflicts between the file's contact info and the page's contact info
   * @param plan The json data to check
   * @returns Whether or not conflicts exist (true if no conlicts, false if conflicts)
   */
  checkContactConflicts(plan: any): boolean {
    let flag = true
    if (plan["assessment-plan"]["metadata"]["parties"]) plan["assessment-plan"]["metadata"]["parties"].forEach((party: any) => {
      if (party.type === "organization") flag = flag && this.contactService.organization.load(party, false);
      if (party.type === "person") flag = flag && this.contactService.person.load(party, false);
    })
    return flag;
  }
}
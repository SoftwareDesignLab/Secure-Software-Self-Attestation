import { Injectable } from '@angular/core';
import { Form } from '../models/attestationModel';
import { AttestationDataService } from './attestation-data.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  #currentPage: BehaviorSubject<string> = new BehaviorSubject("attestation")

  constructor( private attestationDataService: AttestationDataService) {}

  /**
   * Loads a serialized json file into a new form
   * @param plan The plan to load
   * @param useContact Whether to use the contact information in the file or just keep the contact as it was (defaults to using the file)
   */
  loadFromPlan(plan: any, useContact: boolean = true) {
    let form: Form = this.attestationDataService.createNewForm();
    plan.catalogs.forEach((catalog: any) => form.addCatalog(catalog));
    form.load(plan["assessment-plan"])
    if (useContact && plan["assessment-plan"]["metadata"]["parties"]) plan["assessment-plan"]["metadata"]["parties"].forEach((party: any) => {
      if (party.type === "organization") form.metadata.organization.load(party);
      if (party.type === "person") form.metadata.person.load(party);
    })
    this.attestationDataService.form = form;
  }

  get currentPage(): string { return this.#currentPage.getValue(); }
  get observableCurrentPage(): BehaviorSubject<string> { return this.#currentPage; }
  set currentPage(currentPage: string) { this.#currentPage.next(currentPage); }
}
import { Injectable } from '@angular/core';
import { Form } from '../models/attestationModel';
import { AttestationDataService } from './attestation-data.service';
import { BehaviorSubject } from 'rxjs';
import { AssessmentResultsShell } from '../models/resultsModel';

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
  loadFromPlan(plan: any) {
    let form: Form = this.attestationDataService.createNewForm();
    plan.catalogs.forEach((catalog: any) => form.addCatalog(catalog));
    form.load(plan["assessment-plan"])
    this.attestationDataService.form = form;
  }

  loadFromResults(results: any) {
    let form: Form = this.attestationDataService.createNewForm();
    results.catalogs.forEach((catalog: any) => form.addCatalog(catalog));
    form.loadResults(results["assessment-results"] as AssessmentResultsShell)
  }

  get currentPage(): string { return this.#currentPage.getValue(); }
  get observableCurrentPage(): BehaviorSubject<string> { return this.#currentPage; }
  set currentPage(currentPage: string) { this.#currentPage.next(currentPage); }
}
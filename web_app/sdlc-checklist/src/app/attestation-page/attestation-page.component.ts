/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import { Component } from '@angular/core';
import { AttestationDataService } from '../services/attestation-data.service';
import { AssessmentPlanService } from '../services/assessment-plan.service';
import { Form } from '../models/attestationModel';
import { SubjectType, Subject, SubjectLine } from '../models/subjectModel'
import { ContactService } from '../services/contact.service';


@Component({
  selector: 'app-attestation-page',
  templateUrl: './attestation-page.component.html',
  styleUrls: ['./attestation-page.component.css']
})
export class AttestationPageComponent {

  form: Form | undefined;
  // subject: Subject;

  /**
   * Sets up the attestation page and gets the form to load
   */
  constructor(private attestationDataService: AttestationDataService, private assessmentPlanService: AssessmentPlanService, private contactService: ContactService) {
    this.form = this.attestationDataService.activeForm;
    this.attestationDataService.observableActiveForm.subscribe((form) => this.form = form);
    // this.subject = this.form?.subject || new Subject();
    // this.subject.observableType.subscribe(this.updatePageSubject);
    this.updatePageSubject(SubjectType.company);
  }

  /**
   * Changes the attestation subject, setting the radio buttons to match
   * @param newSubject The subject to set to
   */
  updatePageSubject(newSubject: SubjectType) {
    let company = document.getElementById("company-wide");
    let productLine = document.getElementById("product-line");
    let individual = document.getElementById("individual");
    let multiple = document.getElementById("multiple");
    if (company instanceof HTMLInputElement) company.checked = newSubject === SubjectType.company;
    if (productLine instanceof HTMLInputElement) productLine.checked = newSubject === SubjectType.productLine;
    if (individual instanceof HTMLInputElement) individual.checked = newSubject === SubjectType.individual;
    if (multiple instanceof HTMLInputElement) multiple.checked = newSubject === SubjectType.multiple;
    // if (this.form) this.form.subject = this.subject;
  }

  /**
   * Generates an assessment plan
   */
  generateAssessmentPlan() {
    if (this.assessmentPlanService.checkInProgressComments()) {
      this.assessmentPlanService.generateAssessmentPlan();
    } else {
      (document.getElementById("incomplete-comment-dialog") as HTMLDialogElement).showModal();
    }
  }

  /**
   * Adds a new row to the subject table
   */
  addRow() {
    if (this.form) this.form.subject.lines.push(new SubjectLine());
  };
  

  /**
   * Removes the last row from the subject table
   */
  removeRow() {
    if (this.form) this.form.subject.lines.pop();
  }

  /**
   * Checks if the form is completed and the generate button should function
   * @returns Whether the form is completed
   */
  isFormComplete(): boolean {
    return this.contactService.isFilled()
  }

  /**
   * Generates the message to display as a tool tip when hovering over the exclamation point
   * @returns The message, or an empty string if no message applies
   */
  getErrorMessage(): string {
    if (!this.contactService.isFilled()) return "The contact information page is not adequately completed"
    return "";
  }
}

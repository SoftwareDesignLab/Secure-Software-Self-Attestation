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
import { Form } from './models/attestationModel';
import { AssessmentPlanService } from './services/assessment-plan.service';
import { AttestationDataService } from './services/attestation-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFullFooter: boolean = false;
  showNav = false;
  currentPage: string;
  form: Form | undefined;
  treeForm: Form | undefined = undefined;

  constructor( private assessmentPlanService: AssessmentPlanService, private attestationDataService: AttestationDataService ) {
    this.currentPage = assessmentPlanService.currentPage;
    assessmentPlanService.observableCurrentPage.subscribe((pageName) => {this.currentPage = pageName; this.nav = false;});
    this.form = attestationDataService.form;
    attestationDataService.observableForm.subscribe((form) => {this.form = form; this.nav = false;});
  }

  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  toggleNav(): void {
    this.nav = !this.showNav;
  }

  poam(state: boolean): void {
    this.toggleNav();
    if (state) {
      this.assessmentPlanService.currentPage = "poam";
    } else {
      this.assessmentPlanService.currentPage = "attestation";
    }
  }

  newForm(): void {
    (document.getElementById("file") as HTMLInputElement).click();
  }

  switchForm(form: Form): void {
    this.attestationDataService.form = form;
    this.nav = false;
  }

  getForms(): Form[] {
    return this.attestationDataService.forms;
  }

  toggleTree(form: Form) {
    if (this.treeForm === form) {
      this.treeForm = undefined;
    } else {
      this.treeForm = form;
    }
  }

  getSublinks(form: Form): {fragment: string, name: string}[] {
    let sublinks = [{fragment: 'metadata', name: 'Metadata'}]
    form.catalogs.forEach((catalog) => {sublinks.push({fragment: catalog.uuid, name: catalog.metadata.title})});
    return sublinks;
  }

  set nav(truth: boolean) {
    this.showNav = truth;
    let nav = document.getElementById('nav');
    if (nav instanceof HTMLElement) {
      if (this.showNav) {
        nav.classList.add('nav-opening');
        nav.classList.remove('nav-closing');
      } else {
        nav.classList.add('nav-closing');
        nav.classList.remove('nav-opening');
        this.treeForm = undefined;
      }
    }
  }

  delete(form: Form) {
    this.attestationDataService.forms.splice(this.attestationDataService.forms.findIndex((checkForm) => {return checkForm === form}), 1);
    if (form === this.attestationDataService.form) this.attestationDataService.form = undefined;
  }
}

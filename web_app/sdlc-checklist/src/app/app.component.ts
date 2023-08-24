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
import { AttestationDataService } from './services/attestation-data.service';
import { Form } from './models/attestationModel';
import { AssessmentPlanService } from './services/assessment-plan.service';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  #showNav = false;
  openTag: string = "";
  renaming: string = "";
  showComponents = false;
  showFullFooter = false;
  stagedJSON: any = undefined;

  constructor(private attestationService: AttestationDataService, private assessmentPlanService: AssessmentPlanService, private contactService: ContactService){}

  /**
   * Toggles whether the nav is visible
   */
  toggleNav(): void {
    this.showNav = !this.showNav;
  }

  /**
   * Changes which tree, if any, are open
   * @param formTag The tag of the form that should have it's tree toggled
   */
  toggleNavTree(uuid: string): void {
    if (this.openTag === uuid) {
      this.openTag = "";
    } else {
      this.openTag = uuid;
    }
  }

  /**
   * Toggles whether the footer should be expanded
   */
  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  renameForm(uuid: string) {
    this.renaming = uuid;
  }

  confirmName() {
    let newName = document.getElementById("renaming-input");
    if (newName instanceof HTMLInputElement) {
      let form = this.attestationService.forms.find((form) => form.uuid === this.renaming);
      if (form)
        form.name = newName.value;
    }
    this.renaming = "";
  }

  processLoadAttestation(event: Event) {
    let file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.showNav = false;
      this.handleFile(file);
      console.log('File selected:', file);
      (event.target as HTMLInputElement).value = "";
    }
  }

  private handleFile(file: File): void {
    let reader = new FileReader();
    reader.onload = () => {
      let json = JSON.parse(reader.result as string); 
      //todo load as oscal library types
      if (this.assessmentPlanService.checkContactConflicts(json)) {
        this.assessmentPlanService.loadFromPlan(json);
      } else {
        (document.getElementById('contact-decision') as HTMLDialogElement)?.showModal();
        this.stagedJSON = json
      }
    };
    reader.readAsText(file);
  }

  cancelLoad(event?: MouseEvent): void {
    if (event) {
      let dialog = (document.getElementById('contact-decision') as HTMLDialogElement)
      if (0 < event.offsetX && dialog.clientWidth > event.offsetX && 0 < event.offsetY && dialog.clientHeight > event.offsetY)
        return;
    }
    (document.getElementById('contact-decision') as HTMLDialogElement)?.close();
    this.stagedJSON = undefined;
  }

  useExistingContact(): void {
    this.assessmentPlanService.loadFromPlan(this.stagedJSON, false);
    this.cancelLoad();
  }

  useFileContact(): void {
    this.assessmentPlanService.loadFromPlan(this.stagedJSON);
    this.cancelLoad();
  }

  loadAttestation() {
    document.getElementById("load-file-input")?.click();
  }

  getSubLinks(form: Form): {position: number, fragment: string, name: string}[] {
    let position = 0;
    let subLinks: {position: number, fragment: string, name: string}[] = [{position: position++, fragment: 'attestation', name: "Attestation"}];
    form.catalogs.forEach((catalog) => {subLinks.push({position: position++, fragment: "catalog-" + catalog.uuid, name: catalog.metadata.title})});
    subLinks.push({position: position++, fragment: "upload", name: "Upload a Catalog"});
    return subLinks;
  }

  addForm() {
    let form = this.attestationService.createNewForm();
    this.showNav = false;
    this.attestationService.changeAttestation(form, 'attestation');
  }

  deleteForm(uuid: string) {
    this.attestationService.deleteForm(uuid);
  }

  isActiveForm(activeForm: Form | undefined) {
    return this.attestationService.activeForm === activeForm;
  }

  changePage(page: string, fragment?: string) {
    this.showNav = false;
    this.attestationService.changePage(page, fragment);
  }

  changeAttestation(form: Form, fragment?: string) {
    this.showNav = false;
    this.attestationService.changeAttestation(form, fragment);
  }

  isFormComplete() {
    return this.contactService.isFilled();
  }

  getErrorMessage() {
    if (!this.contactService.isFilled()) return "The contact information page is not adequately completed"
    return "";
  }

  cancelSave(event?: MouseEvent) {
    if (event) {
      let dialog = (document.getElementById('incomplete-comment-dialog') as HTMLDialogElement)
      if (0 < event.offsetX && dialog.clientWidth > event.offsetX && 0 < event.offsetY && dialog.clientHeight > event.offsetY)
        return;
    }
    (document.getElementById('incomplete-comment-dialog') as HTMLDialogElement)?.close();
  }

  finishSave() {
    this.assessmentPlanService.generateAssessmentPlan();
  }

  get activeFormName(): string {
    return this.attestationService.activeForm?.name || "Contact Info";
  }

  get forms(): Form[] { return this.attestationService.forms; }

  get showNav(): boolean { return this.#showNav; }
  set showNav(showNav: boolean) {     
    this.#showNav = showNav;
    let nav = document.getElementById('nav');
    if (nav instanceof HTMLElement) {
      if (showNav) {
        nav.classList.add('nav-opening');
        nav.classList.remove('nav-closing');
      } else {
        nav.classList.add('nav-closing');
        nav.classList.remove('nav-opening');
        this.openTag = "";
        this.renaming = "";
      }
    } 
  }
}


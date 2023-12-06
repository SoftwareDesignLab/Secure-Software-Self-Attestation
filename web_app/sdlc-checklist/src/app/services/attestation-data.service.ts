/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Form, Result } from '../models/attestationModel';
import { Metadata } from '../models/contactModel';
import { ContactService } from './contact.service';
import { AssessmentPlanService } from './assessment-plan.service';
import catalog from '../defaultCatalog';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const dela = (ms : number) => new Promise(res => setTimeout(res, ms))

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {
  forms: Form[] = [];
  #activeForm: BehaviorSubject<Form | undefined> = new BehaviorSubject<Form | undefined>(undefined);
  #oscalCatalogs: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private router: Router, private contactService: ContactService) {}

  /**
   * Creates a new form and adds it to forms
   * @returns The new form
   */
  createNewForm(startingCatalog: boolean = true) {
    let newForm = new Form(startingCatalog);
    this.forms.push(newForm);
    this.#activeForm.next(newForm)

    let oscalCatalogs = this.#oscalCatalogs.getValue();
    oscalCatalogs.push(catalog);
    this.#oscalCatalogs.next(oscalCatalogs);

    return newForm
  }

  appendNewOscalCatalog(catalog: any) {
    let catalogs = this.#oscalCatalogs.getValue();
    console.log("pushed catalog");
    catalogs.push(catalog);
    this.#oscalCatalogs.next(catalogs);
  }

  removeOscalCatalog(uuid: string) {
    let catalogs = this.#oscalCatalogs.getValue();
    catalogs.splice(catalogs.findIndex((catalog) => (catalog.uuid === uuid)), 1);
    this.#oscalCatalogs.next(catalogs);
  }


  /**
   * Deletes the given form
   * @param uuid The uuid of the form to delete (defaults to the active form if left blank)
   */
  deleteForm(uuid?: string) {
    let form: Form | undefined
    if (uuid) {
      form = this.forms.find((form) => (form.uuid === uuid))
    } else {
      form = this.activeForm;
    }
    if (form) {
      this.forms.splice(this.forms.findIndex(del => del === form), 1)
    }
    if (form === this.activeForm) {
      this.router.navigate(['contact-info']);
      this.activeForm = undefined;
    }
  }

  /**
   * Changes the current page
   * @param page The page name to change to
   * @param fragment The fragment identifier to scroll to
   */
  async changePage(page: string, fragment?: string){
    if (page === "contact-info") { this.activeForm = undefined; }
    if (fragment) {
      this.router.navigate([page], {fragment: fragment});
      await dela(50);
      let parent = document.getElementById(fragment);
      if (parent instanceof HTMLElement) {
        let newFocus = this.findFirstLandingChildr(parent);
        if (newFocus instanceof HTMLElement) {
          newFocus.focus();
        }
      }
    } else {
      this.router.navigate([page])
    }
  }

  /**
   * Recursively identifies the first descendant element to have the class "landing"
   * @param parent The parent to search from
   * @returns The element with "landing", null if none exists
   */
  findFirstLandingChildr(parent: HTMLElement): HTMLElement | null {
    let children = parent.children;
    for (let i = 0, max = children.length; i < max; i++) {
      let child = children[i];
      if (child instanceof HTMLElement) {
        if (child.classList.contains('landing'))
          return child;
      }
      if (child instanceof HTMLElement) {
        let recurse = this.findFirstLandingChildr(child);
        if (recurse instanceof HTMLElement) {
          return recurse;
        }
      }
    }
    return null;
  }

  /**
   * Changes the current page to attestation-form and changes the active form
   * @param form The form to change to
   * @param fragment (optional) The fragment to scroll to
   */
  changeAttestation(form: Form, fragment?: string) {
    this.activeForm = form;
    this.changePage('attestation-form', fragment);
  }

  /**
   * Gets the active form
   * @returns The active form's list of catalogs
   */
  get activeForm(): Form | undefined { return this.#activeForm.getValue(); }
  get observableActiveForm(): BehaviorSubject<Form | undefined> { return this.#activeForm; }
  set activeForm(form: Form | undefined) {this.#activeForm.next(form); }

  getUniqueOscalCatalogs() {
    let catalogs: any[] = this.#oscalCatalogs.getValue();
    let uniqueCatalogs: any[] = [];
    let catalogNames: string[] = [];
    for (let i = 0; i < catalogs.length; i++) {
      if (!catalogNames.includes(catalogs[i].metadata.title)) {
        catalogNames.push(catalogs[i].metadata.title);
        uniqueCatalogs.push(catalogs[i]);
      }
    }
    return uniqueCatalogs;
  }

  formToAssessmentPlan(form: Form): any {
    return form.serialize(form.metadata.serialize(form.name, this.contactService.organization, this.contactService.person));
  }

  generateAssessmentResults() {
    let metadata = new Metadata().serialize("Attestation results for " + this.contactService.organization.name, this.contactService.organization, this.contactService.person);
    let importAP = { href: "" }; //TODO make master assessment plan for all attestations + 3rd party tests, and reference it here
    let results: any[] = []; 
    let resultForAttestations = { //TODO type this
      "uuid": uuidv4(),
      "title": "Attestation Results",
      "description": "Results of the various attestations",
      "start": new Date().toISOString(),
      "reviewed-controls": {
        "props": new Array(),
        "links": new Array(),
        "control-selections": new Array()
      },
      "attestations": new Array()
    }
    
    this.forms.forEach((form) => {

      let attestation = {
        "responsible-parties": new Array(),
        parts: new Array()
      }
      attestation.parts.push({
        "name": "Attestation Title",
        "title": "Name of the attestation",
        "prose": form.name,
        "class": "Attestation Metadata"
      });

      for (let i = 0; i < form.subject.lines.length; i++) {
        let line = form.subject.lines[i];
        attestation.parts.push({
          "name": "Attestation Subject",
          "title": "What is being attested to?",
          "prose": "Name: " + line.name + "\nVersion: " + line.version + "\nDate Created: " + line.date,
          "class": "Attestation Metadata"
        });
      }
      
      form.catalogs.forEach((catalog) => {
        //if catalog not in reviewed-controls props
        let catalogIndex = resultForAttestations['reviewed-controls'].props.length //IF any other props are necessary this won't work properly
        if (resultForAttestations['reviewed-controls'].props.findIndex((prop: any) => (prop.name === catalog.metadata.title)) === -1) {
          resultForAttestations['reviewed-controls'].props.push({
            "name": catalog.metadata.title,
            "value": catalogIndex.toString(), 
            "class": "Catalog Order"
          });

          resultForAttestations['reviewed-controls']['control-selections'].push({ "include-controls": [] });
          
          Array.from(catalog.controlMap.keys()).forEach((key: string) => {
            const control = catalog.controlMap.get(key);
            if (control) {
              if (control.result !== Result.blank)  {
                resultForAttestations['reviewed-controls']['control-selections'][catalogIndex]["include-controls"].push({ "control-id": control.id });
                // attestation.parts.push({
                //   "name": control.id,
                //   "title": "Compliance status for " + control.id,
                //   "prose": control.result.toString(),
                //   "class": "Compliance"
                // });
                // if (control.commentFinalized) {
                //   attestation.parts.push({
                //     "name": control.id,
                //     "title": "Explanation for " + control.id,
                //     "prose": control.comment,
                //     "class": "Explanation"
                //   });
                // }
            }
          }
          });
        }
      });

      //control Hack begins here
      let ap = this.formToAssessmentPlan(form);
      let controlSelections = ap['reviewed-controls']['control-selections'];
      controlSelections.forEach((selection: any) => {
        selection.props.forEach((prop: any) => {
          let part = {
            name: prop.name,
            title: "",
            class: "",
            prose: ""
          }
          //even hackier
          const complianceMap: { [key: string]: string } = {
            "yes": "1",
            "no": "2",
            "n/a": "3"
          }
          
          if (prop.class === "Compliance Claim") {
            part.class = "Compliance";
            part.title = "Compliance status for " + prop.name;
            part.prose = complianceMap[prop.value];
            attestation.parts.push(part);
          }
          if (prop.class === "Attestation Claim") {
            part.class = "Explanation";
            part.title = "Explanation for " + prop.name;
            part.prose = prop.value;
            attestation.parts.push(part);
          }
        });
      });

      resultForAttestations.attestations.push(attestation);
    });

    results.push(resultForAttestations);
    const assessmentResults = {
      uuid: uuidv4(),
      "metadata": metadata,
      "import-assessment-plan": importAP,
      "results": results
    }

    return assessmentResults;
  }
}
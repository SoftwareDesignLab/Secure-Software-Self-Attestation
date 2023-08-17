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
import { Router, NavigationEnd, RouterModule  } from '@angular/router';
import { CatalogShell } from './models/catalogModel';
import { Form } from './models/attestationModel';
import { AssessmentPlanService } from './services/assessment-plan.service';

interface CatalogData {
  catalogs: CatalogShell[];
}

const dela = (ms : number) => new Promise(res => setTimeout(res, ms))

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNav = false;
  openTag: string = "";
  renaming: string = "";
  showComponents = false;
  showFullFooter = false;

  constructor(private router: Router, private attestationService: AttestationDataService, 
              private assessmentPlanService: AssessmentPlanService){}
  
  ngOnInit(){
  }

  /**
   * Changes the current page
   * @param page The page name to change to
   * @param fragment The fragment identifier to scroll to
   */
  async changePage(page: string, fragment?: string){
    this.setNav(false);
    if(page === "contact-info") { this.attestationService.activeForm = undefined; }
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
   * Toggles whether the nav is visible
   */
  toggleNav(): void {
    this.setNav(!this.showNav);
  }

  /**
   * Sets the nav to the provided state
   * @param state The state to set the nav to
   */
  setNav(state: boolean): void {
    this.showNav = state;
    let nav = document.getElementById('nav');
    if (nav instanceof HTMLElement) {
      if (this.showNav) {
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
      this.setNav(false);
      this.handleFile(file);
      console.log('File selected:', file);
      (event.target as HTMLInputElement).value = "";
    }
  }

  private handleFile(file: File): void {
    let reader = new FileReader();
    reader.onload = () => {
      let json = JSON.parse(reader.result as string);
      this.assessmentPlanService.loadFromPlan(json);
    };
    reader.readAsText(file);
  }

  loadAttestation() {
    document.getElementById("load-file-input")?.click();
  }

  changeAttestation(form: Form, fragment?: string) {
    this.attestationService.activeForm = form;
    this.changePage('attestation-form', fragment);
  }

  getSubLinks(form: Form): {position: number, fragment: string, name: string}[] {
    let position = 0;
    let subLinks: {position: number, fragment: string, name: string}[] = [{position: position++, fragment: 'attestation', name: "Attestation"}];
    form.catalogs.forEach((catalog) => {subLinks.push({position: position++, fragment: "catalog-" + catalog.uuid, name: catalog.metadata.title})});
    subLinks.push({position: position++, fragment: "upload", name: "Upload a Catalog"});
    return subLinks;
  }

  addForm() {
    this.attestationService.createNewForm();
    this.changePage('attestation-form');
  }

  deleteForm(uuid: string) {
    this.attestationService.deleteForm(uuid);
  }

  get activeFormName(): string {
    return this.attestationService.activeForm?.name || "Contact Info";
  }

  get forms(): Form[] { return this.attestationService.forms; }
}


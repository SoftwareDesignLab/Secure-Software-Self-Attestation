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
import { Component, ViewChildren, QueryList, ViewChild, NgModule } from '@angular/core';
import { GroupComponent } from './group/group.component';
import catalog from './defaultCatalog';
import { AttestationDataService } from './services/attestation-data.service';
import { notifyService } from './services/notify.service';
import { Router, NavigationEnd, RouterModule  } from '@angular/router';
import { ChecklistItemComponent } from './control/control.component';
import { ViewportScroller } from '@angular/common';
import { delay, filter, takeUntil  } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { AttestationPageComponent } from './attestation-page/attestation-page.component';
import { AttestationComponent } from './attestation/attestation.component';
import { TemplateLiteral } from '@angular/compiler';
import { ContactService } from './services/contact.service';
import { AssessmentPlanService } from './services/assessment-plan.service';
import { CatalogShell } from './models/catalogModel';

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
  catalogData: CatalogData = {catalogs: []};
  showNav = false;
  openTag = 0;
  renaming = 0;
  showComponents = false;
  showFullFooter = false;
  bypass = false;

  constructor(private router: Router, private attestationService: AttestationDataService, private contactService: ContactService,
    private assessmentPlanService: AssessmentPlanService ){}
  
  ngOnInit(){
  }

  ////// Temp Bypass code (press f2 to toggle generate report button regardless of contact info)
  onKeyPressed(event: KeyboardEvent) {
    if (event.key === "F2") {
      this.bypass= !this.bypass;;
    }
  }
  //////

  /**
   * Changes the current page
   * @param page The page name to change to
   * @param fragment The fragment identifier to scroll to
   */
  async changePage(page: string, fragment?: string){
    this.toggleNav();
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
   * Gets the array of all attestation components
   */
  get getForms(){
    return [];
  }

  /**
   * Changes the currently visible form
   * @param form The form to change to
   * @param fragment The fragment identifier to scroll to
   */
  changeAttestation(form: AttestationComponent, fragment?: string){
    this.changePage('attestation-form', fragment);
  }
  
  /**
   * Creates a new attestation form
   */
  newForm(){
  }

  /**
   * Deletes the provided form
   * @param position The position of the form to delete
   */
  deleteForm(position: number){
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
        this.openTag = 0;
        this.renaming = 0;
      }
    }
  }

  /**
   * Changes which tree, if any, are open
   * @param formTag The tag of the form that should have it's tree toggled
   */
  toggleNavTree(formTag: number): void {
    if (this.openTag === formTag) {
      this.openTag = 0;
    } else {
      this.openTag = formTag;
    }
  }

  /**
   * Gets the user-friendly link name for a given catalog
   * @param catalog The catalog to make a name for
   * @returns The name
   */
  getLinkName(catalog: any): string {
    return "";
  }

  /**
   * Toggles whether the footer should be expanded
   */
  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  /**
   * Allows the HTML to push alerts
   * @param message The message to alert
   */
  alert(message: string) {
    alert(message);
  }

  /**
   * Gets a list of sublinks to display in the tree
   * @param form The Attestation that is being expanded
   * @returns A list of names, fragments, and indexes to allow the sublinks to work
   */
  getSubLinks(form: AttestationComponent): Array<{name: string, fragment: string, position: number}> {
    let listOLinks: Array<{name: string, fragment: string, position: number}> = [];
    let i = 0;
    listOLinks.push({name: "Select Attestation Type", fragment: "attestation", position: i++})
    form.getCatalogs.catalogs.forEach((catalog: any) => {
      listOLinks.push({name: this.getLinkName(catalog), fragment: "catalog-" + catalog.uuid, position: i++});
    });
    listOLinks.push({name: "Upload new catalog / Generate Report", fragment: "upload", position: i++});
    return listOLinks;
  }

  /**
   * Allows the user to change the name of the form
   * @param form The attestation to rename
   */
  async renameForm(form: AttestationComponent) {
    this.renaming = form.getPositionTag;
    this.openTag = 0;
    await dela(50);
    let input = document.getElementById("renaming-input");
    if (input instanceof HTMLInputElement) {
      input.select();
    }
  }

  /**
   * Sets the name in the "renaming-input" textbox to the attestation
   * @param form The attestation to rename
   */
  confirmName(form: AttestationComponent) {
  }

  /**
   * Gets a user-friendly page name
   * @returns The name of the current page
   */
  getPageName() {
  }

  /**
   * 
   * @param num The number of numbers to return
   * @returns Returns a list of numbers 1 to num-1
   */
  range(num: number): Array<number> {
    return Array.from(Array(num).keys())
  }

  /**
   * Cancels the loading of an attestation
   */
  cancelLoad(event?: MouseEvent) {
    let dialog = document.getElementById("contact-decision")
    if (dialog instanceof HTMLDialogElement) {
      if (event) {
        if ((event.clientX > dialog.offsetLeft && event.clientX < (dialog.offsetLeft + dialog.offsetWidth) && event.clientY > dialog.offsetTop && event.clientY < (dialog.offsetHeight + dialog.offsetTop)) || dialog.offsetHeight === 0) return;
      }
      dialog.close();
    }
  }

  loadAttestation() {
    let upload = document.getElementById("load-file-input")
    if (upload instanceof HTMLElement) {
      upload.click();
    }
  }

  processLoadAttestation(input: Event) {
    const file = (input.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFile(file);
      console.log('File selected:', file);
    } else { return }
    if (input.target instanceof HTMLInputElement) {
      input.target.value = "";
    }
  }

  private handleFile(file: File) {
    let reader = new FileReader();
    reader.onload = () => {
      let json = JSON.parse(reader.result as string);
    };
    reader.readAsText(file);
  }

  async useExistingContact() {
  }

  async useFileContact() {
  }
  
   /** Checks if the report can be generated 
   * @returns if valid true, otherwise false
   */
  generateAcceptable(){
    if(this.router.url=="/contact-info"){
      return false;
    }
    if(this.bypass){
      return true;
    }
    return false;
  }
  /**
   * checks if the contact tool tip should appear
   * @returns true if the contact info tool-tip should appear
   */
  invalidContact(){
    if(this.generateAcceptable()){
      return false
    }
    if(this.contactService.isFilled()){
      return false
    }
    return true;
  }

  /**
   * checks if the attestation type missing tool tip should appear
   * @returns true only if it should appear, otherwise false
   */
  attestationTypeMissing(){
    if(this.invalidContact()){
      return false
    } 
    if(this.router.url=="/contact-info"){
      return false;
    }
    return true;
  }
}


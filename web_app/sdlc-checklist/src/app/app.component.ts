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

interface Catalog {
  uuid: string;
  metadata: object;
  groups: GroupComponent[];
  controls: ChecklistItemComponent[];
}

interface CatalogData {
  catalogs: Catalog[];
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


  constructor(private router: Router, private attestationService: AttestationDataService, private contactService: ContactService, private assessmentPlanService: AssessmentPlanService ){}
  
  ngOnInit(){
    if (this.attestationService.getdata(0))
      this.catalogData = this.attestationService.getdata(0).getCatalogs
    
      ////// Temp Bypass Code
      document.addEventListener('keydown', this.onKeyPressed.bind(this));
      //////
  }

  ////// Temp Bypass code (press f2 to toggle generate report button regardless of contact info)
  onKeyPressed(event: KeyboardEvent) {
    if (event.key === "F2") {
      this.bypass=true
      this.contactService.bypass = !this.contactService.bypass;
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
          console.log("Refocus");
          newFocus.focus();
        }
      }
    } else {
      this.router.navigate([page])
    }
    if (page === "contact-info")
      this.attestationService.pageName = "Contact Info";
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
    return this.attestationService.getRawData;
  }

  /**
   * Changes the currently visible form
   * @param form The form to change to
   * @param fragment The fragment identifier to scroll to
   */
  changeAttestation(form: AttestationComponent, fragment?: string){
    this.attestationService.pageName = form.getName();
    this.attestationService.setView(form.getFormPosition);
    this.attestationService.updateDynamicForm(this.attestationService.getCurrentForm);
    this.attestationService.refresh();
    this.changePage('attestation-form', fragment);
  }
  
  /**
   * Creates a new attestation form
   */
  newForm(){
    this.attestationService.addform();
    let newPage = this.attestationService.getdata(this.attestationService.getRawData.length-1);
    this.changeAttestation(newPage);
  }

  /**
   * Deletes the provided form
   * @param position The position of the form to delete
   */
  deleteForm(position: number){
    this.openTag = 0;
    this.attestationService.setDeletionPosition(position)
    let firsthalf = this.attestationService.forms.slice(0,position);
    let secondhalf = this.attestationService.forms.slice(position+1)
    this.attestationService.forms[position].deleteAll();
    if((position)===this.attestationService.getView){
      this.setNav(true);
      this.attestationService.pageName = "Contact Info";
      this.changePage('contact-info');
    }
    this.attestationService.forms = firsthalf.concat(secondhalf);
    
    if(this.attestationService.getRawData.length>0){
      this.attestationService.setView(0);
      let newPos = 0;
      this.attestationService.forms.forEach(child => {
        child.setFormPosition(newPos);
        newPos = newPos+1;
      });
    }
    else{
      this.attestationService.setView(-1);
    }
    
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
  getLinkName(catalog: Catalog): string {
    let metadata: any = catalog.metadata;
    if (metadata.title) {
      return metadata.title;
    }
    return catalog.uuid;
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
    form.getCatalogs.catalogs.forEach((catalog) => {
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
    let input = document.getElementById("renaming-input");
    if (input instanceof HTMLInputElement) {
      form.setName(input.value);
      this.renaming = 0;
      if (form === this.attestationService.getCurrentForm) {
        this.attestationService.pageName = form.getName();
      }
    }
  }

  /**
   * Gets a user-friendly page name
   * @returns The name of the current page
   */
  getPageName(): string {
    return this.attestationService.pageName;
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
    let dialog = document.getElementById("needed-files-upload")
    if (dialog instanceof HTMLDialogElement) {
      if (event) {
        if (event.clientX > dialog.offsetLeft && event.clientX < (dialog.offsetLeft + dialog.offsetWidth) && event.clientY > dialog.offsetTop && event.clientY < (dialog.offsetHeight + dialog.offsetTop)) return;
      }
      dialog.close();
    }
    this.deleteForm(this.attestationService.getCurrentForm.getFormPosition);
    this.attestationService.neededControls = new Set<string>();
    this.attestationService.stagedJSON = null;
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
      let uploadButton = document.getElementById('file');
      if (uploadButton instanceof HTMLInputElement) {
        uploadButton.value = "";
      }
    } else { return }
    if (input.target instanceof HTMLInputElement) {
      input.target.value = "";
    }
    let dialog = document.getElementById("needed-files-upload")
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  }

  private handleFile(file: File): void {
    let reader = new FileReader();
    reader.onload = () => {
      let json = JSON.parse(reader.result as string);
      this.attestationService.stagedJSON = json;
      console.log(json)
      let include = json["reviewed-controls"]["control-selections"]
      if (include !== undefined) {
        include.forEach((catalog: any) => {
          if (catalog["include-controls"]) {
            catalog["include-controls"].forEach((control: any) => {
              if (control["control-id"]) this.attestationService.neededControls.add(control["control-id"]);
            })
          } else if (catalog["include-all"]) {
            catalog["props"].forEach((control: any) => {
              if (control.class === "Compliance Claim") this.attestationService.neededControls.add(control.name);
            })
          }
        })
      }
      this.attestationService.checkNeededControls();
    };
    reader.readAsText(file);
  }

  async loadCatalogForLoadAttestation() {
    let upload = document.getElementById("file")
    if (upload instanceof HTMLElement) {
      upload.click();
    }
  }

  getNeededControls(): Set<string> {
    return this.attestationService.neededControls;
  }
}


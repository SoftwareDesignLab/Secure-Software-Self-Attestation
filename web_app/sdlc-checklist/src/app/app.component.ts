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
import { Router, NavigationEnd, RouterModule  } from '@angular/router';
import { AttestationDataService } from './attestation-data.service';
import { notifyService } from './notify.service';
import { ChecklistItemComponent } from './control/control.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { ViewportScroller } from '@angular/common';
import { delay, filter, takeUntil  } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { AttestationPageComponent } from './attestation-page/attestation-page.component';
import { AttestationComponent } from './attestation/attestation.component';

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
  @ViewChild(CatalogProcessingComponent) catalogProcessingComponent!: CatalogProcessingComponent;
  showNav = false;
  openTag = 0;
  renaming = 0;
  showComponents = false;
  showFullFooter = false;

  constructor(private router: Router, private attestationService: AttestationDataService ){}
  
  ngOnInit(){
    if (this.attestationService.getdata(0))
      this.catalogData = this.attestationService.getdata(0).getCatalogs
  }

  changePage(page: string, fragment?: string){
    this.toggleNav();
    if (fragment) {
      this.router.navigate([page], {fragment: fragment});
    } else {
      this.router.navigate([page])
    }
    if (page === "contact-info")
      this.attestationService.pageName = "Contact Info";
  }

  get getForms(){
    return this.attestationService.getRawData;
  }

  changeAttestation(form: AttestationComponent, fragment?: string){
    this.attestationService.pageName = form.getName();
    this.attestationService.setView(form.getFormPosition);
    this.attestationService.updateDynamicForm(this.attestationService.getCurrentForm);
    this.attestationService.refresh();
    this.changePage('attestation-form', fragment);
  }
  
  newForm(){
    this.attestationService.addform();
    let newPage = this.attestationService.getdata(this.attestationService.getRawData.length-1);
    this.changeAttestation(newPage);
  }

  deleteForm(position: number){
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

  toggleNav(): void {
    this.setNav(!this.showNav);
  }

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

  toggleNavTree(formTag: number): void {
    if (this.openTag === formTag) {
      this.openTag = 0;
    } else {
      this.openTag = formTag;
    }
  }

  getLinkName(catalog: Catalog): string {
    let metadata: any = catalog.metadata;
    if (metadata.title) {
      return metadata.title;
    }
    return catalog.uuid;
  }

  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  alert(message: string) {
    alert(message);
  }

  getSubLinks(form: AttestationComponent): Set<{name: string, fragment: string}> {
    let listOLinks: Set<{name: string, fragment: string}> = new Set();
    listOLinks.add({name: "Secure Software Development Attestation Form", fragment: "attestation"})
    form.getCatalogs.catalogs.forEach((catalog) => {
      listOLinks.add({name: this.getLinkName(catalog), fragment: "catalog-" + catalog.uuid});
    });
    listOLinks.add({name: "Upload new catalog / Generate Report", fragment: "upload"});
    return listOLinks;
  }

  async renameForm(form: AttestationComponent) {
    this.renaming = form.getPositionTag;
    await dela(50);
    let input = document.getElementById("renaming-input");
    if (input instanceof HTMLInputElement) {
      input.select();
    }
  }

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

  getPageName(): string {
    return this.attestationService.pageName;
  }
}


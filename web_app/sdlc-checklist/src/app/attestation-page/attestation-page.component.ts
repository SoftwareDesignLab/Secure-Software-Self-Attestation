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


import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from '../group/group.component';
import catalog from '../defaultCatalog';

import { AttestationDataService } from '../services/attestation-data.service';
import { attestationComment } from '../services/attestationForm';
import { CatalogData, Catalog} from '../models/catalogModel';
import { AttestationComponent } from '../attestation/attestation.component';


@Component({
  selector: 'app-attestation-page',
  templateUrl: './attestation-page.component.html',
  styleUrls: ['./attestation-page.component.css']
})
export class AttestationPageComponent {

  catalogData: CatalogData = {catalogs: []};
  showComponentsArray: any;
  hiddenCatalogs: any
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  showNav = false;
  viewPosition = 0;
  position;

  observedForm!: AttestationComponent;

  selectedValue!: string;
  info: any;

  constructor(public attestationService: AttestationDataService){
      this.selectedValue = attestationService.getCurrentForm.getSelectedValue;
      this.info = attestationService.getCurrentForm.getInfo;
      this.catalogData = this.attestationService.getCurrentForm.getCatalogs;
      this.hiddenCatalogs = this.attestationService.getCurrentForm.getHiddenCatalogs();
      this.position = this.attestationService.getCurrentForm.getPositionTag;
  }


  ngOnInit(): void {

    this.catalogData = this.attestationService.getCurrentForm.getCatalogs;

    this.attestationService.ComponentRefresh$.subscribe(() => {
      this.refresh();
    });


      this.attestationService.dynamicForm$.subscribe(form => {
      this.observedForm = form;
      this.selectedValue = form.getSelectedValue;
      this.info = form.getInfo
      this.position = form.getPositionTag
      this.catalogData = form.getCatalogs;
      this.hiddenCatalogs = form.getHiddenCatalogs();
    });
  }

  refresh(){ 
    this.childComponents.forEach((child) => {
      child.refresh() 
    });
  }
  
  AttestationCompleted(){
    if(this.observedForm.submitable()){
      return true;
    }
    else{
      return false;
      }
  }


  updateSelect(){
    this.attestationService.getCurrentForm.setSelectedValue(this.selectedValue);
    if (this.selectedValue !== 'multiple') {
      if (this.info.length > 1) {
        this.info.splice(1);
      }
    }
    console.log(this.info.length);
  }


  addRow(){
    this.info.push(new attestationComment)
  }

  removeRow(){
    this.info.pop();
  }

  onKey(event: any, attest: attestationComment, target: string) { 
    if(target==="name") {
      attest.addName(event.target.value);
    } else if (target==="version") {
      attest.addVersion(event.target.value);
    } else if (target==="date") {
      attest.addDate(event.target.value);
    }
  }


  onFileSelected(jsonData: any): void {
    this.attestationService.getCurrentForm.onFileSelected(jsonData);
  }

  setAllGroupExpansion(toSet: boolean, uuid: String): void {
    this.childComponents.forEach((child) => {
      if (child.catalogUUID === uuid) {
        child.setComponents(toSet);
      }
    });
  }


  toggleExpansion(uuid: String): void {
    this.attestationService.getCurrentForm.toggleExpansion(uuid);
  }

  isShown(uuid: String): boolean {
    return !this.hiddenCatalogs.has(uuid);
  }

  removeCatalog(uuid: String): void {
    this.attestationService.getCurrentForm.removeCatalog(uuid);
  }

  restoreDefaultCatalog(): void {
    this.attestationService.getCurrentForm.restoreDefaultCatalog();
  }
  
  isDefaultPresent(): boolean {
    let index = this.catalogData.catalogs.findIndex((value)=>{return value.uuid === catalog.uuid});
    return index >= 0;
  }

  alert(message: string) {
    alert(message);
  }
}

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


import { Component, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { GroupComponent } from '../group/group.component';
import catalog from '../defaultCatalog';
import { AttestationDataService } from '../attestation-data.service';
import { attestationComment } from '../attestationForm';
import { CatalogData} from '../oscalModel';
import { AttestationComponent } from '../attestation/attestation.component';
import { CatalogProcessingComponent } from '../catalog-processing/catalog-processing.component';



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
  @ViewChild(CatalogProcessingComponent) catalogProcessingComponent!: CatalogProcessingComponent;
  control: string = "Ungrouped Controls";
  showNav = false;
  viewPosition = 0;
  position;
  observedForm!: AttestationComponent;
  selectedValue!: string;
  info: any;

  /**
   * A constructor to grab the data to use from the correct attestation
   * @param attestationService The global attestation data service
   */
  constructor(public attestationService: AttestationDataService){
      this.selectedValue = attestationService.getCurrentForm.getSelectedValue;
      this.info = attestationService.getCurrentForm.getInfo;
      this.catalogData = this.attestationService.getCurrentForm.getCatalogs;
      this.hiddenCatalogs = this.attestationService.getCurrentForm.getHiddenCatalogs();
      this.position = this.attestationService.getCurrentForm.getPositionTag;
  }

  /**
   * Sets up the parts of the form
   */
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

  /**
   * Calls the refresh method for each group
   */
  refresh(): void { 
    this.childComponents.forEach((child) => {
      child.refresh() 
    });
  }
  
  /**
   * 
   * @returns Whether or not the top attestation form is complete
   */
  AttestationCompleted(): boolean {
    if(this.observedForm.submitable()){
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * Updates when the top attestation form radio input is changed
   */
  updateSelect(): void {
    this.attestationService.getCurrentForm.setSelectedValue(this.selectedValue);
    if (this.selectedValue !== 'multiple') {
      if (this.info.length > 1) {
        this.info.splice(1);
      }
    }
    console.log(this.info.length);
  }

  /**
   * Adds a new attestation comment in multiple product mode
   */
  addRow(){
    this.info.push(new attestationComment)
  }

  /**
   * Removes the most recent attestation comment in multiple product mode
   */
  removeRow(){
    this.info.pop();
  }

  /**
   * Runs when the top form receives any change
   * @param event The key or click event
   * @param attest The attestation comment row
   * @param target The column of data being changed
   */
  onKey(event: any, attest: attestationComment, target: string) { 
    if(target==="name") {
      attest.addName(event.target.value);
    } else if (target==="version") {
      attest.addVersion(event.target.value);
    } else if (target==="date") {
      attest.addDate(event.target.value);
    }
  }

  /**
   * Adds a new catalog
   * @param jsonData The data of the selected catalog
   */
  onFileSelected(jsonData: any): void {
    let message = this.attestationService.getCurrentForm.onFileSelected(jsonData);
    if (message.success) {
      this.catalogProcessingComponent.notifyOfSuccess(message.message);
    } else {
      this.catalogProcessingComponent.notifyOfFailure(message.message);
    }
  }

  /**
   * Sets the expansion of all groups, usually when the entire catalog is collapsed
   * @param toSet The state to set them all to
   * @param uuid The uuid of the catalog to change
   */
  setAllGroupExpansion(toSet: boolean, uuid: String): void {
    this.childComponents.forEach((child) => {
      if (child.catalogUUID === uuid) {
        child.setComponents(toSet);
      }
    });
  }

  /**
   * Toggles the expansion of the selected catalog
   * @param uuid The uuid of the catalog to toggle
   */
  toggleExpansion(uuid: String): void {
    this.attestationService.getCurrentForm.toggleExpansion(uuid);
  }

  /**
   * 
   * @param uuid The uuid of the catalog to check
   * @returns whether or not the selected catalog should be visible
   */
  isShown(uuid: String): boolean {
    return !this.hiddenCatalogs.has(uuid);
  }

  /**
   * Removes tge selected catalog
   * @param uuid The uuid of the catalog to delete
   */
  removeCatalog(uuid: String): void {
    this.attestationService.getCurrentForm.removeCatalog(uuid);
  }

  /**
   * Restores the default catalog if it got deleted
   */
  restoreDefaultCatalog(): void {
    this.attestationService.getCurrentForm.restoreDefaultCatalog();
  }
  
  /**
   * Checks whether or not the default catalog is still present
   * @returns whether or not the default catalog is still present
   */
  isDefaultPresent(): boolean {
    let index = this.catalogData.catalogs.findIndex((value)=>{return value.uuid === catalog.uuid});
    return index >= 0;
  }

  /**
   * Allows the HTML to send alerts
   * @param message The message to be alerted
   */
  alert(message: string) {
    alert(message);
  }
}

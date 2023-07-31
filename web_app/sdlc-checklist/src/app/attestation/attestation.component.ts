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
import { attestationComment } from '../models/attestationForm';
import { AttestationDataService } from '../services/attestation-data.service';
import { Catalog, CatalogData } from '../models/catalogModel';
import catalog from '../defaultCatalog';
import { ChecklistItemComponent } from '../control/control.component';
import { AssessmentPlanService } from '../services/assessment-plan.service';


@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {

  private catalogData: CatalogData = {catalogs: []};
  private hiddenCatalogs = new Set<string>();
  private attestationType: string = ''; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private FormPosition: any;
  private positionTag: any;
  private displayName: string = "";

   /**
   * Constructor
   * @param attestationService Links to the global attestation data service
   */
  constructor (private attestationService: AttestationDataService, private assessmentPlanService: AssessmentPlanService, isUnused: Boolean = false){
    this.info.push(new attestationComment);
    this.catalogData.catalogs.push(catalog as Catalog);
    if (!isUnused) { //kind of hacky, but works just fine
      this.assessmentPlanService.addAssessmentPlan(this.getName());
      this.assessmentPlanService.addCatalog(catalog as Catalog);
    }
  }

  /**
   * Sets the position tag, used to give each form a unique default name
   * @param pos the new position tag
   */
  setPositionTag(pos: number){
    this.positionTag = pos;
  }

  /**
   * Sets the form position, used to identify the form
   * @param pos the new form position
   */
  setFormPosition(pos: number){
    this.FormPosition = pos; 
  }

  /**
   * Sets the display name, uses a variation of the position tag if the string supplied is empty
   * @param name The new display name
   */
  setName(name: string) {
    this.displayName = name;
    this.assessmentPlanService.updateAssessmentPlanName(this.getName());
  }

  /**
   * A getter for the private position tag attribute
   */
  get getPositionTag(){
    return this.positionTag;
  }

  /**
   * A getter for the private form position attribute
   */
  get getFormPosition(){
    return this.FormPosition;
  }

  /**
   * A getter for the display name, returns a default name if the variable is empty
   * @returns The current display name
   */
  getName() {
    if (this.displayName)
      return this.displayName;
    return "Attestation Form " + this.positionTag;
  }

  // Attestation Comments Methods 

  /**
   * Adds a new attestation comment
   */
  addRow(){
    this.info.push(new attestationComment);
  }

  /**
   * Removes the most recently added attestation comment
   */
  removeRow(){
    this.info.pop();
  }

  get getAttestationType(){
    return this.attestationType;
  }

  setAttestationType(value: string){
    this.attestationType = value;
    this.assessmentPlanService.setAttestationType(value);
  }

  /**
   * Returns the private info attribute
   */
  get getInfo(){
    return this.info;
  }

  /**
   * Detects if the attestation form is complete
   * @returns whether or not the form at the top of the page is satisfactory
   */
  submitable(){
    if(this.attestationType=='company'){
      return true;
    }
    return this.info[0].isFilled();
  }

  // Catalogs Methods 

  /**
   * Returns the catalodData object of the attestation, which contains an array of catalogs
   */
  get getCatalogs(){
    return this.catalogData;
  }

  /**
   * Adds the newly provided catalog to the attestation
   * @param jsonData The data of the new catalog
   */
  onFileSelected(jsonData: any): {message: string, success: boolean} {
    if (this.catalogData.catalogs.findIndex((value) => {return value.uuid === jsonData.uuid;}) !== -1) { // Prevents uploading the same file twice
      return {message: "This catalog has already been loaded in this attestation form", success: false}
    }
    this.catalogData.catalogs.push(jsonData);
    return {message: "New catalog loaded!", success: true}
  }

  /**
   * Removes a specified catalog
   * @param uuid The uuid of the catalog to be removed
   */
  removeCatalog(uuid: string): void {
    this.assessmentPlanService.removeCatalog(uuid);
    let catalogs = this.catalogData.catalogs;
    let removed = catalogs.splice(catalogs.findIndex((value)=>{return value.uuid === uuid}), 1) as Catalog[];
    this.attestationService.setDeletionPosition(this.attestationService.getCurrentForm.getFormPosition);
    this.deleteCache(removed[0]);
  }

  /**
   * Deletes all user-supplied data from a catalog, usually when tha catalog itself is removed
   * @param catalog The catalog to be deleted
   */
  deleteCache(catalog: Catalog){
    let deletePosition = this.attestationService.getDeletionPosition;
    console.log("Removing " + catalog.uuid + " from Attestation: " + this.attestationService.getdata(deletePosition).positionTag);
    if(catalog.groups !== undefined){
      catalog.groups.forEach(group => {
        let GUID = catalog.uuid + "-" + group.id;
        this.attestationService.removeGroup(GUID);
        if (group.controls !== undefined) {
          group.controls.forEach((control: ChecklistItemComponent) => {
            let CUID = catalog.uuid + "-" + control.id;
            this.attestationService.removeControl(CUID);
          });
        }
      });
    } 
    if(catalog.controls !== undefined){
      catalog.controls.forEach((control: ChecklistItemComponent) => {
        let CUID = catalog.uuid + "-" + control.id;
        this.attestationService.removeControl(CUID);
     });
   }
  }

  /**
   * Deletes the user supplied data of all catalogs
   */
  deleteAll(){
    this.catalogData.catalogs.forEach(catalog =>{
      this.deleteCache(catalog);
    });
  }

  /**
   * Adds the default catalog back if it was deleted
   */
  restoreDefaultCatalog(): void {
    this.catalogData.catalogs.unshift(catalog as Catalog);   
    this.assessmentPlanService.addCatalog(catalog as Catalog);
  }

  /**
   * 
   * @returns a set of catalog uuids that should be hidden
   */
  getHiddenCatalogs(){
    return this.hiddenCatalogs;
  }

  /**
   * Hides or shows a specific catalog
   * @param uuid The catalog to be hidden
   */
  toggleExpansion(uuid: string): void {
    if (this.hiddenCatalogs.has(uuid)) {
      this.hiddenCatalogs.delete(uuid);
    } else {
      this.hiddenCatalogs.add(uuid);
    }
  }
}


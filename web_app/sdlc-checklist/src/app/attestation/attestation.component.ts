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

import { Component} from '@angular/core';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';
import { Catalog, CatalogData} from '../oscalModel';
import catalog from '../defaultCatalog';
import { ChecklistItemComponent } from '../control/control.component';



@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {

  private catalogData: CatalogData = {catalogs: []};
  private hiddenCatalogs = new Set<String>();
  private selectedValue: string = ''; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private index: any;
  private position: any;

  constructor (private attestationService: AttestationDataService){
    this.info.push(new attestationComment);
    this.catalogData.catalogs.push(catalog as Catalog);    
  }


  setPosition(pos: number){
    this.position = pos;
   }
   setIndex(ind: number){
    this.index = ind; 
   }

   get getPosition(){
    return this.position;
   }
  get getIndex(){
    return this.index;
  }

  // Attestation Comments Methods 

  addRow(){
    this.info.push(new attestationComment);
  }

  removeRow(){
    this.info.pop();
  }

  get getSelectedValue(){
    return this.selectedValue;
  }

  setSelectedValue(value: string){
    this.selectedValue = value;
  }

  get getInfo(){
    return this.info;
  }


  submitable(){
    if(this.selectedValue=='company'){
      return true;
    }
    return this.info[0].isFilled();
  }


  // Catalogs Methods 

  get getCatalogs(){
    return this.catalogData;
  }


  
  onFileSelected(jsonData: any): void {
    if (this.catalogData.catalogs.findIndex((value) => {return value.uuid === jsonData.uuid;}) !== -1) // Prevents uploading the same file twice
      return;
    this.catalogData.catalogs.push(jsonData);
  }

  removeCatalog(uuid: String): void {
    let catalogs = this.catalogData.catalogs;
    let removed = catalogs.splice(catalogs.findIndex((value)=>{return value.uuid === uuid}), 1) as Catalog[];
    this.attestationService.setDeletionPosition(this.attestationService.getCurrentForm.getPosition);
    this.deleteCache(removed[0]);
  }

  deleteCache(catalog: Catalog){
    console.log("Removing " + catalog.uuid + " from Attestation: " + this.attestationService.getDeletionPosition);
    if(catalog.groups !== undefined){
      catalog.groups.forEach(group => {
        let GUID = catalog.uuid + "-" + group.id;
        this.attestationService.removeGroup(GUID);
        group.controls.forEach((control: ChecklistItemComponent) => {
          let CUID = catalog.uuid + "-" + control.id;
          this.attestationService.removeControl(CUID);
        });
      });
    } 
    if(catalog.controls !== undefined){
      catalog.controls.forEach((control: ChecklistItemComponent) => {
        let CUID = catalog.uuid + "-" + control.id;
        this.attestationService.removeControl(CUID);
     });
   }
  }

  deleteAll(){
    this.catalogData.catalogs.forEach(catalog =>{
      this.deleteCache(catalog);
    });
  }

  restoreDefaultCatalog(): void {
    this.catalogData.catalogs.unshift(catalog as Catalog);   
  }

  getHiddenCatalogs(){
    return this.hiddenCatalogs;
  }

  toggleExpansion(uuid: String): void {
    if (this.hiddenCatalogs.has(uuid)) {
      this.hiddenCatalogs.delete(uuid);
    } else {
      this.hiddenCatalogs.add(uuid);
    }
  }


}


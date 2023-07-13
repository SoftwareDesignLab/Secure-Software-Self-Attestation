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

import { Component, QueryList, ViewChildren } from '@angular/core';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';
import { Catalog, CatalogData } from '../oscalModel';
import catalog from '../defaultCatalog';



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
  private position: any;

  constructor (){
    this.info.push(new attestationComment);
    this.catalogData.catalogs.push(catalog as Catalog);    
  }


  setPosition(pos: number){
    this.position = pos;
   }

   get getPosition(){
    return this.position;
   }
  

  // Attestation Comments Methods 

  addRow(){
    this.info.push(new attestationComment)
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
    console.log("Removing " + uuid);
    catalogs.splice(catalogs.findIndex((value)=>{return value.uuid === uuid}), 1);
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


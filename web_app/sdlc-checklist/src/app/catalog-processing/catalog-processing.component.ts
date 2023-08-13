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
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CatalogShell, MetadataShell } from '../models/catalogModel';
import { notifyService } from '../services/notify.service';
import { AttestationDataService } from '../services/attestation-data.service';


@Component({
  selector: 'app-catalog-processing',
  templateUrl: './catalog-processing.component.html',
  styleUrls: ['./catalog-processing.component.css'],
})
export class CatalogProcessingComponent {
  @Input() accept = '.json';
  @ViewChild('fileInput') fileInput!: ElementRef;

  /**
   * 
   * @param notifications Prepares the notification service
   */
  constructor(private notifications: notifyService, private attestationDataService: AttestationDataService ){
  }

  /**
   * Runs when a file is uploaded via the button
   * @param event the file upload event
   */
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      //TODO verify that the file is an OSCAL Catalog
      this.handleFile(file);
      console.log('File selected:', file);
      let uploadButton = document.getElementById('file');
      if (uploadButton instanceof HTMLInputElement) {
        uploadButton.value = "";
      }
    } else {
      this.notifications.error("Please select an OSCAL Catalog JSON file.");
    }
  }

  /**
   * Occurs when a file is hovering over the drop area
   * @param event The drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * Runs when a file us dropped into the dotted box
   * @param event The drop event
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      this.handleFile(file);
      console.log('File dropped:', file);
    } else {
      this.notifications.error("Please drop an OSCAL Catalog JSON file.");
    }
  }

  /**
   * Displays a green message in the bottom corner
   * @param message The message to display
   */
  notifyOfSuccess(message: string) {
    this.notifications.success(message);
  }

  /**
   * Displays a red message in the bottom corner
   * @param message The message to display
   */
  notifyOfFailure(message: string) {
    this.notifications.error(message);
  }

  /**
   * Checks if the file is a json
   * @param file The file to check
   * @returns whether it is a json
   */
  private isJsonFile(file: File): boolean {
    return file.type === 'application/json' || file.name.endsWith('.json');
  }

  /**
   * Checks if the data object has a catalog nested inside
   * @param data The object to check
   * @returns Whether there is a nested catalog
   */
  private isNested(data: object): boolean{
    let oscalObj = data as {catalog: any};
    if(oscalObj.catalog != undefined){
      return true;
    }
    return false;
  }

  /**
   * Checks if the provided JSON file is a valid OSCAL catalog and if it has an extra nest
   * object
   * 
   * @param data The json object that was recieved
   * @returns returns 0 for fail, 1 for success and 2 for nested and succeeded
   */
  private isValidCatalog(data: object): boolean{
    let isValid : boolean = false;
    let catalog = data as CatalogShell;
    if(catalog.uuid!= undefined){
      var UIDpattern = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[45][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/
      if(UIDpattern.test(catalog.uuid)){
      isValid = true;
      }
    } else {
      var UIDkey= /\w+-uuid\b/;
      for (const key in catalog){
        if (UIDkey.test(key)){
          isValid = true;
        }
      }
    }
    if(!isValid){
      console.log("Missing/invalid uuid");
    }
    if(catalog.metadata != undefined){
      let metaData = catalog.metadata as MetadataShell;
      if(metaData.title == undefined){
        isValid = false;
        console.log("Missing MetaData: title ");
      }
      if(metaData['last-modified']== undefined){
          isValid = false;
          console.log("Missing MetaData: last-modified ");
      }
      if(metaData.version == undefined){
          isValid = false;
          console.log("Missing MetaData: version ");
      }
      if(metaData['oscal-version'] == undefined){
          isValid = false;
          console.log("Missing MetaData: oscal-version ");
      }
    }
    else{
      isValid = false;
      console.log("Missing MetaData");
    }
    if (isValid){
      return true;
    }
    this.notifications.error("Given json file is not a valid OSCAL Catalog")
    return false;
  }


  /**
   * Handles the uploaded file
   * @param file The uploaded file
   */
  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      const catalog = this.isNested(json) ? json.catalog : json;
      // quality checks OSCAL file
      if(this.isValidCatalog(catalog)){
        const catalogClone = JSON.parse(JSON.stringify(catalog)) as CatalogShell;
        this.attestationDataService.activeForm?.addCatalog(catalogClone);
      }
    };
    reader.readAsText(file);
  }
}
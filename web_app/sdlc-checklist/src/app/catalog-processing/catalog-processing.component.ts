import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Oscal, metaData } from '../oscalModel';
@Component({
  selector: 'app-catalog-processing',
  templateUrl: './catalog-processing.component.html',
  styleUrls: ['./catalog-processing.component.css'],
})
export class CatalogProcessingComponent {
  @Input() accept = '.json';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      //TODO verify that the file is an OSCAL Catalog
      this.handleFile(file);
      console.log('File selected:', file);
    } else {
      alert('Please upload an OSCAL Catalog JSON file.');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      this.handleFile(file);
      console.log('File dropped:', file);
    } else {
      alert('Please drop an OSCAL Catalog JSON file.');
    }
  }

  private isJsonFile(file: File): boolean {
    return file.type === 'application/json' || file.name.endsWith('.json');
  }


  /**
   * Checks if the provided JSON file is a valid OSCAL control catalog
   * 
   * @param info The json object that was recieved
   * @returns boolean whether it a valid OSCAL or not
   */
  private isValidOscal(info: object): boolean{
    let isValid : boolean = true;
    let oscalObj = info as Oscal;
    if (oscalObj.uuid == undefined){
      isValid = false;
      console.log('uid not found');
    }
    if(oscalObj.metadata != undefined){
      let metaData = oscalObj.metadata as metaData;
      if(metaData.title == undefined){
        isValid = false;
        console.log("Missing MetaData: title ")
      }
      if(metaData.last_modified == undefined){
          isValid = false;
          console.log("Missing MetaData: last_modified ")
      }
      if(metaData.version == undefined){
          isValid = false;
          console.log("Missing MetaData: version ")
      }
      if(metaData.oscal_version == undefined){
          isValid = false;
          console.log("Missing MetaData: oscal_version ")
      }
      if(metaData.published == undefined){
          isValid = false;
          console.log("Missing MetaData: published ")
      }
    }
    else{
      isValid = false;
      console.log("Missing MetaData");
    }
    if (!isValid){ 
      alert('Given json file is not a valid OSCAL file');
    }
    else if (oscalObj.groups == undefined || oscalObj.groups.length==0){
      alert('Given OSCAL file has no controls')
      console.log("No Controls Present")
      return false;
    }
    return isValid;
  }


  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      // quality checks OSCAL file
      if(this.isValidOscal(json)){
        this.fileSelected.emit(json);
      }
    };
    reader.readAsText(file);
  }
}
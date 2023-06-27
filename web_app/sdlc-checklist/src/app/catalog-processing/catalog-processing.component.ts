import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Oscal, metaData, catalog } from '../oscalModel';
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
   * Checks if the provided JSON file is a valid OSCAL catalog and if it has an extra nest
   * object
   * 
   * @param info The json object that was recieved
   * @returns returns 0 for fail, 1 for success and 2 for nested and succeeded
   */
  private isValidCatalog(info: object): number{
    let isValid : boolean = false;
    let oscalObj = info as Oscal;
    let catalog = info as catalog;
    var Nested = false;
    if(oscalObj.catalog != undefined){
        catalog = oscalObj.catalog;
        Nested = true;
    }
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
      console.log("Missing/invalid uuid")
    }
   
    if(catalog.metadata != undefined){
      let metaData = catalog.metadata as metaData;
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
    if (!isValid){ 
      alert('Given json file is not a valid OSCAL Catalog');
    }
    else if (catalog.groups == undefined || catalog.groups.length==0){
      alert('Given OSCAL file has no controls')
      console.log("No Controls Present")
      return 0;
    }
    if (isValid && Nested){
      return 2;

    } else if (isValid){
      return 1
    }
    return 0;
  }


  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      // quality checks OSCAL file
      if(this.isValidCatalog(json) == 1){
        this.fileSelected.emit(json);
      }
      else if (this.isValidCatalog(json)== 2){
        this.fileSelected.emit(json.catalog);
      }
    };
    reader.readAsText(file);
  }
}
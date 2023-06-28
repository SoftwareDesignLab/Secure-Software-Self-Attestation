import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Oscal, metaData, catalog } from '../oscalModel';
import { ErrorHandlerService } from '../error-handler.service';

enum processingErrors{
  Valid = 0,
  WrongFileType = 1,
  notCatalog = 2
}

@Component({
  selector: 'app-catalog-processing',
  templateUrl: './catalog-processing.component.html',
  styleUrls: ['./catalog-processing.component.css'],
})
export class CatalogProcessingComponent {
  @Input() accept = '.json';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileSelected = new EventEmitter<File>();
  Error: processingErrors = processingErrors.Valid;
  //issue: processingErrors = processingErrors.Valid;

  


  constructor(private  errorService: ErrorHandlerService) {

    this.errorService.hasIssue.subscribe( value => {
        this.Error = value;
    });
}

  public get processingErrors(): typeof processingErrors {
    return processingErrors; 
  }
  //   <app-error-pop-up *ngIf="Error==processingErrors.notCatalog"></app-error-pop-up>

  onFileSelected(event: Event): processingErrors {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.errorService.hasIssue.next(processingErrors.Valid);
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      //TODO verify that the file is an OSCAL Catalog
      this.handleFile(file);
      console.log('File selected:', file);
    } else {
      alert('Please upload an OSCAL Catalog JSON file.');
      this.errorService.hasIssue.next(processingErrors.WrongFileType);
    }
    return this.Error;
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

  private isNested(data: object): boolean{
    let oscalObj = data as Oscal;
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
    let catalog = data as catalog;
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
    if (isValid){
      return true;
    }
    alert('Given json file is not a valid OSCAL Catalog');
    return false;
  }


  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      const catalog = this.isNested(json) ? json.catalog : json;
      // quality checks OSCAL file
      if(this.isValidCatalog(catalog)){
        this.fileSelected.emit(catalog);
      }
      else{
        this.errorService.hasIssue.next(processingErrors.notCatalog);
      }
    };
    reader.readAsText(file);
  }
}
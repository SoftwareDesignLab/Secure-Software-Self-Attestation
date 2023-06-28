import { Component } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
//import { processingErrors } from './error-Enum';

enum processingErrors{
  Valid = 0,
  WrongFileType = 1,
  notCatalog = 2
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  catalogData: any;
  issue:  processingErrors = processingErrors.Valid;
  
  onFileSelected(jsonData: any): void {
    this.catalogData = jsonData;
  }

  public get processingErrors(): typeof processingErrors {
    return processingErrors; 
  }

  constructor(private errorService: ErrorHandlerService) {

    this.errorService.hasIssue.subscribe( value => {
        this.issue = value;
    });
}
}
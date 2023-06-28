import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum processingErrors{
  Valid = 0,
  WrongFileType = 1,
  notCatalog = 2
}



@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public hasIssue: BehaviorSubject<processingErrors> = new BehaviorSubject<processingErrors>(processingErrors.Valid);
  constructor() { }
}

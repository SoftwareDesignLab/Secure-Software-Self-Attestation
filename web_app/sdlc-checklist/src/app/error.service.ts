import { Injectable } from '@angular/core';

export  const errorEnum  = Object.freeze({
  valid: "Valid",
  dupUUID: "File has duplicate UUID",
  notCatalog: "Not a valid catalog",
  invalidMetaData: "MetaData missing/formated wrong",
  wrongFileType: "Not a JSON file"
});

//
// valid: 'valid',
// dupUUID,
// notCatalog,
// invalidMetaData,
// wrongFileType



@Injectable({
  providedIn: 'root'
})
export class ErrorService {
 currentError: any = "valid";

  public setError(error: string){
    console.warn(error)
    this.currentError = error;
  }
  public getError(){
    return this.currentError;
  }
}

import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {

  private selectedValue: string = 'company'; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private submit: boolean = false;

  constructor() {
    this.info.push(new attestationComment);
   }

  getSelectedValue(){
    return this.selectedValue;
  }

  getInfo(){
    return this.info;
  }

  getSubmit(){
    return this.submit
  }

  setSelectedValue(data: string){
    this.selectedValue = data;
  }

  setInfo(data: Array<attestationComment>){
    this.info = data;
  }

  toggleSubmit(){
    this.submit = true;
  }
}

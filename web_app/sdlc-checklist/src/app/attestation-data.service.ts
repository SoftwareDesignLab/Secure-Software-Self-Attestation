import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {

  private selectedValue: string = 'company'; 
  private row: number = 1;
  private info: Array<attestationComment> = new Array<attestationComment>;
  

  constructor() {
    this.info.push(new attestationComment);
   }


  getSelectedValue(){
    return this.selectedValue;
  }

  getRow(){
    return this.row;
  }

  getInfo(){
    return this.info;
  }

  setSelectedValue(data: string){
    this.selectedValue = data;
  }
  setRow(data: number){
    this.row = data;
  }

  setInfo(data: Array<attestationComment>){
    this.info = data;
  }

}

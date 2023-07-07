import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {

  private selectedValue: string = ''; 
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

  addInfo(data: attestationComment){
    this.info.push(data);
  }
  popInfo(){
    this.info.pop();
  }


  submitable(){
    if(this.selectedValue=='company'){
      return true
    }
    return this.info[0].isFilled()
  }

  visited(){
    return this.submit;
  }
  seen(){
    this.submit = true;
  }

  validComments(){
    let valid = true;
    this.info.forEach(function(comment){
      if(!comment.isFilled()){
        valid=false;
      }
    });
    return valid;
  }
}

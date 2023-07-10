import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';
import { AttestationComponent } from './attestation/attestation.component';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {


  private forms: Array<AttestationComponent> = new Array<AttestationComponent>
  private beenVisited: boolean = false;

  //private selectedValue: string = ''; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private submit: boolean = false;

  constructor() {
    this.forms.push(new AttestationComponent)
   }


   getdata(index: number){
    return this.forms[index];
  }
  get getRawData(){
    return this.forms;
  }

  visited(){
    return this.beenVisited;
  }
  seen(){
    this.beenVisited = true;
  }

  addform(){
    this.forms.push(new AttestationComponent);
    let pos = this.forms.length;
    this.forms[pos-1].setPosition(pos);
  }
}

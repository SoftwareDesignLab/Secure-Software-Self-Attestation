import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';
import { AttestationComponent } from './attestation/attestation.component';
import { ControlInfo } from './oscalModel';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {


  private forms: Array<AttestationComponent> = new Array<AttestationComponent>
  private beenVisited: boolean = false;
  controlMap: Map<string, ControlInfo> = new Map<string, ControlInfo>

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

  setUpControl(UID: string): ControlInfo | undefined{
    if(this.controlMap.has(UID)){
      return(this.controlMap.get(UID));
    }
    else{
     let info = new ControlInfo();
     this.controlMap.set(UID, info);
     return info;
    }
  }

  updateControlSelection(UID: string, selection: String){
    let temp = this.controlMap.get(UID);
    if(temp!=undefined){
      temp.selection=selection
    }
    else{
      console.log("Something went wrong")
    }
  }
}

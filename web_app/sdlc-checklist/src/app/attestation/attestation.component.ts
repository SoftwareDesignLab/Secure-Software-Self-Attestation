import { Component } from '@angular/core';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';


@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {


  private selectedValue: string = ''; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private submit: boolean = false;
  private position: any;

  constructor (){
    this.info.push(new attestationComment);
  }


  setPosition(pos: number){
    this.position = pos;
   }

   get getPosition(){
    return this.position;
   }
  

  addRow(){
    this.info.push(new attestationComment)
    //this.dataService.addInfo(new attestationComment);
  }

  removeRow(){
    this.info.pop();
    //this.dataService.popInfo();
  }



  get getSelectedValue(){
    return this.selectedValue;
  }

  setSelectedValue(value: string){
    this.selectedValue = value;
  }

  get getInfo(){
    return this.info;
  }

  onKey(event: any, attest: attestationComment, target: string) { 
    if(target==="name") {
      attest.addName(event.target.value);
    } else if (target==="version") {
      attest.addVersion(event.target.value);
    } else if (target==="date") {
      attest.addDate(event.target.value);
    }
  }


  submitable(){
    if(this.selectedValue=='company'){
      return true;
    }
    return this.info[0].isFilled();
  }

    
}

import { Component } from '@angular/core';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';


@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {
  selectedValue: string;
  //dataService: AttestationDataService;

  constructor( public dataService: AttestationDataService ){
    this.selectedValue = dataService.getSelectedValue();
    
  }


  onSubmit() {
    this.dataService.setSelectedValue(this.selectedValue);
    this.dataService.toggleSubmit();
    console.log("Attestation Submitted");
  }
  addRow(){
    this.dataService.addInfo(new attestationComment);
  }
  removeRow(){
    this.dataService.popInfo();
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

  validComments(){
    let valid = true;
    this.dataService.getInfo().forEach(function (comment) {  
      if(!comment.isFilled()){
        valid=false;
      }  
      });  
      return valid;
    }
  updateSelect(){
    this.dataService.setSelectedValue(this.selectedValue);
  }

}

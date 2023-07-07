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
  info: Array<attestationComment>;
  dataService: AttestationDataService;

  constructor( DataService: AttestationDataService ){
    this.dataService = DataService;
    this.selectedValue = DataService.getSelectedValue();
    this.info = DataService.getInfo();
  }


  onSubmit() {
    this.dataService.setSelectedValue(this.selectedValue);
    this.dataService.toggleSubmit();
    //this.dialogRef.close();
    console.log("Attestation Submitted");
  }
  
  addRow(){
    this.info.push(new attestationComment);
  }

  removeRow(){
    this.info.pop();
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
    this.info.forEach(function (comment) {  
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

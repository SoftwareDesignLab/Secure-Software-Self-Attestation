import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { attestationComment } from '../attestationForm';


@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {
  selectedValue: string = 'company'; 
  row: number = 1;
  info: Array<attestationComment> = new Array<attestationComment>;

  constructor(private dialogRef: MatDialogRef<AttestationComponent>){}


  onSubmit() {
    console.log(this.selectedValue); 
    this.dialogRef.close();
  }
  addRow(){
    this.info.push(new attestationComment);
    console.log(this.info.length);
  }
  removeRow(){
    this.info.pop();
    console.log(this.info.length);
  }

  ngOnInit(){
    this.info.push(new attestationComment);
  }

  onKey(event: any, attest: attestationComment, target: string) { // without type info
    if(target==="name") {
      attest.addName(event.target.value);
    } else if (target==="version") {
      attest.addVersion(event.target.value)
    } else if (target==="date") {
      attest.addDate(event.target.value)
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

  debug(){
    console.log(this.info[0].getName());
    console.log(this.info[0].getVersion());
    console.log(this.info[0].getDate());
    console.warn(this.info[0].isFilled());
  }
}

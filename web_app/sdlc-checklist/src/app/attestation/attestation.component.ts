import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {
  selectedValue: string = 'company'; 

  constructor(private dialogRef: MatDialogRef<AttestationComponent>){}


  onSubmit() {
    console.log(this.selectedValue); 
    this.dialogRef.close();
  }
}

/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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

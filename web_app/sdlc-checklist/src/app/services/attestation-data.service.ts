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
import { Injectable } from '@angular/core';
import { AttestationComponent } from '../attestation/attestation.component';
import { ControlAttestation, GroupInfo } from '../models/catalogModel';

import { BehaviorSubject, Subject } from 'rxjs';
import { AssessmentPlanService } from './assessment-plan.service';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {


  private ComponentRefreshSource = new Subject<void>();
  ComponentRefresh$ = this.ComponentRefreshSource.asObservable();

  public forms: Array<AttestationComponent> = new Array<AttestationComponent>
  private beenVisited: boolean = false;
  private controlMap: Map<string, ControlAttestation> = new Map<string, ControlAttestation>
  private groupMap: Map<string, GroupInfo> = new Map<string, ControlAttestation>
  private tag: number = 1;
  private viewPosition: number = -1;
  private deletionPosition: number = 0;
  public pageName: string = "Contact Info";


  private dynamicFormSubject: BehaviorSubject<AttestationComponent> = new BehaviorSubject<AttestationComponent>(new AttestationComponent(this, this.assessmentPlanService));
  public dynamicForm$ = this.dynamicFormSubject.asObservable();

  constructor(private assessmentPlanService: AssessmentPlanService) {}
  
  refresh(){
      this.ComponentRefreshSource.next();
  }
  updateDynamicForm(form: AttestationComponent) {
    this.dynamicFormSubject.next(form);
  }

  setDeletionPosition(position: number){
    this.deletionPosition= position;
    // remove assessment plan in the assessment plan service
    this.assessmentPlanService.removeAssessmentPlan(position);
  }

  getdata(position: number){
    return this.forms[position];
  }

  get getCurrentForm(){
    return this.forms[this.viewPosition];
  }

  setView(position: number){
    this.assessmentPlanService.setAttestationFocus(position);
    this.viewPosition = position;
  }
  get getRawData(){
    return this.forms;
  }

  

  get getView(){
    return this.viewPosition;
  }

  get getDeletionPosition(){
    return this.deletionPosition;
  }

  addform(){
    // initialize assessment plan in the assessment plan service
    this.assessmentPlanService.addAssessmentPlan("Attestation Form "+(this.getRawData.length));
    this.forms.push(new AttestationComponent(this, this.assessmentPlanService));
    let position = this.forms.length-1;
    this.forms[position].setPositionTag(this.tag);
    this.forms[position].setFormPosition(position);
    this.tag = this.tag + 1;


  }



  // Control Methods 

  setUpControl(UID: string): ControlAttestation | undefined{
    if(this.controlMap.has(UID)){
      return(this.controlMap.get(UID));
    }
    else{
     let info = new ControlAttestation();
     this.controlMap.set(UID, info);
     return info;
    }
  }

  updateControlSelection(UID: string, selection: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.selection=selection
      // A little hacky
      const controlUID = UID.split("-").at(-1) || "";
      this.assessmentPlanService.setControlSelection(controlUID, selection);
    }
    else{
      console.log("Something went wrong")
    }
  }

  saveControlComment(UID: string, comment: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.finalized=false;
      temp.comment=comment;
    }
    else{
      console.log("Something went wrong")
    }


  }
  finalizeControlComment(UID: string, comment: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.finalized=true;
      temp.comment=comment;
      const controlUID = UID.split("-").at(-1) || ""; // kind of hacky
      this.assessmentPlanService.setControlComment(controlUID, comment)
    }
    else{
      console.log("Something went wrong")
    }
  }


  deleteControlComment(UID: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.comment = "";
      temp.finalized = false;
      this.assessmentPlanService.removeControlComment(UID);
    }

  }

  toggleControlRollable(UID: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }

  removeControl(UID: string){
    let position = this.getdata(this.deletionPosition).getPositionTag;
    let temp = position + "-" + UID;
    this.controlMap.delete(temp);
  }


  // Group methods
  
  setUpGroup(UID: string): GroupInfo | undefined{
    if(this.groupMap.has(UID)){
      return(this.groupMap.get(UID));
    }
    else{
     let info = new GroupInfo();
     this.groupMap.set(UID, info);
     return info;
    }
  }

  toggleGroupRollable(UID: string){
    let temp = this.groupMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }

  removeGroup(UID: string){
    let position = this.getdata(this.deletionPosition).getPositionTag;
    let temp = position + "-" + UID;
    this.groupMap.delete(temp);
  }
}



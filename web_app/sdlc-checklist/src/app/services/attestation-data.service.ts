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
  private tag: number;
  private viewPosition: number = -1;
  private deletionPosition: number = 0;
  public pageName: string = "Contact Info";
  private displayIDMap: Map<String, number> = new Map<string, number>
  private catalogPosition: Map<String, number> = new Map<string, number>





  private dynamicFormSubject: BehaviorSubject<AttestationComponent> = new BehaviorSubject<AttestationComponent>(new AttestationComponent(this, this.assessmentPlanService, true));
  public dynamicForm$ = this.dynamicFormSubject.asObservable();

  constructor(private assessmentPlanService: AssessmentPlanService) {
    this.tag = 0;
  }
  
  refresh(){
      this.ComponentRefreshSource.next();
  }
  updateDynamicForm(form: AttestationComponent) {
    this.dynamicFormSubject.next(form);
  }

  setDeletionPosition(position: number){
    this.deletionPosition= position;
    // remove assessment plan in the assessment plan service
  }

  getdata(position: number){
    return this.forms[position];
  }

  get getCurrentForm(){
    this.catalogPosition = this.forms[this.viewPosition].getCatalogPositions
    return this.forms[this.viewPosition];
  }

  getCatalogIndex(catalogUUID: string){
    return this.catalogPosition.get(catalogUUID);
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

  setTag(){
    this.tag +=1;
    return this.tag;
  }

  addform(){
    this.assessmentPlanService.setAttestationFocus(this.forms.length);
    this.forms.push(new AttestationComponent(this, this.assessmentPlanService));
    let position = this.forms.length-1;
    this.forms[position].setFormPosition(position);
  }

  // Control Methods 

  setUpControl(UID: string): ControlAttestation | undefined{
    if(this.controlMap.has(UID)){
      return(this.controlMap.get(UID));
    }
    else{
      const controlID = UID.split("-").at(-1) || ""; // kind of hacky
      let displayID = controlID;
      if(this.displayIDMap.has(controlID)){
        let amount = this.displayIDMap.get(controlID);
        if(amount!=undefined){
          displayID = displayID + " (" +  this.displayIDMap.get(controlID) + ")";
          this.displayIDMap.set(controlID, amount+1);
        } else {
          console.warn("undefined UID?");
        }
      } else {
        this.displayIDMap.set(controlID, 1);
      }
     let info = new ControlAttestation(displayID);
     this.controlMap.set(UID, info);
     return info;
    }
  }

  uidToUuid(UID: string){
    let temp = UID.split("-") || ""; // kind of hacky
    let catalogUUID = "";
    for (let i = 1; i < temp.length-1; i++) {
      catalogUUID = catalogUUID + "-" +temp[i]
    }
    return catalogUUID.substring(1);
  }

  updateControlSelection(UID: string, selection: string){
    const catalogUUID = this.uidToUuid(UID);
    let index = this.catalogPosition.get(catalogUUID);
    let temp = this.controlMap.get(UID);
    if(temp!==undefined && index !== undefined){
      this.assessmentPlanService.setControlSelection(temp.displayID, selection, index);
      temp.selection=selection
    }
    else{
      console.log("Something went wrong")
    }
  }

  saveControlComment(UID: string, comment: string){
    console.log(UID)
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
    //const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    //this.assessmentPlanService.setControlComment(controlID, comment);

    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      this.assessmentPlanService.setControlComment(temp.displayID, comment);
      temp.finalized=true;
      temp.comment=comment;
    }
    else{
      console.log("Something went wrong")
    }
  }


  deleteControlComment(UID: string){
    //const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    //this.assessmentPlanService.removeControlComment(controlID);

    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      this.assessmentPlanService.removeControlComment(temp.displayID);
      temp.comment = "";
      temp.finalized = false;
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



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
import { AttestationComponent } from './attestation/attestation.component';
import { ControlInfo, GroupInfo } from './oscalModel';

import { BehaviorSubject, Subject } from 'rxjs';
import { AttestationPageComponent } from './attestation-page/attestation-page.component';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {


  private ComponentRefreshSource = new Subject<void>();
  ComponentRefresh$ = this.ComponentRefreshSource.asObservable();

  public forms: Array<AttestationComponent> = new Array<AttestationComponent>
  private beenVisited: boolean = false;
  private controlMap: Map<String, ControlInfo> = new Map<String, ControlInfo>
  private groupMap: Map<String, GroupInfo> = new Map<String, ControlInfo>
  private count: number = 1;
  private viewPosition: number = 0;


  private dynamicFormSubject: BehaviorSubject<AttestationComponent> = new BehaviorSubject<AttestationComponent>(new AttestationComponent);
  public dynamicForm$ = this.dynamicFormSubject.asObservable();

  constructor() {}
  
  refresh(){
      this.ComponentRefreshSource.next();
  }
  updateDynamicForm(form: AttestationComponent) {
    this.dynamicFormSubject.next(form);
  }

  getdata(index: number){
    return this.forms[index];
  }

  get getCurrentForm(){
    return this.forms[this.viewPosition];
  }

  setView(position: number){
    this.viewPosition = position;
  }
  get getRawData(){
    return this.forms;
  }

  checkVisited(){
    return this.beenVisited;
  }
  setVisited(){
    this.beenVisited = true;
  }

  addform(){
    this.forms.push(new AttestationComponent);
    let index = this.forms.length-1;
    this.forms[index].setPosition(this.count);
    this.forms[index].setIndex(index);
    this.count = this.count + 1;


  }



  // Control Methods 

  setUpControl(UID: String): ControlInfo | undefined{
    if(this.controlMap.has(UID)){
      return(this.controlMap.get(UID));
    }
    else{
     let info = new ControlInfo();
     this.controlMap.set(UID, info);
     return info;
    }
  }

  updateControlSelection(UID: String, selection: String){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.selection=selection;
    }
    else{
      console.log("Something went wrong")
    }
  }

  saveControlComment(UID: String, comment: String){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.finalized=false;
      temp.comment=comment;
    }
    else{
      console.log("Something went wrong")
    }


  }
  finalizeControlComment(UID: String, comment: String){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.finalized=true;
      temp.comment=comment;
    }
    else{
      console.log("Something went wrong")
    }


  }
  deleteControlComment(UID: String){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.comment = "";
      temp.finalized = false;
    }

  }

  toggleControlRollable(UID: String){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }


  // Group methods
  
  setUpGroup(UID: String): GroupInfo | undefined{
    if(this.groupMap.has(UID)){
      return(this.groupMap.get(UID));
    }
    else{
     let info = new GroupInfo();
     this.groupMap.set(UID, info);
     return info;
    }
  }

  toggleGroupRollable(UID: String){
    let temp = this.groupMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }
}



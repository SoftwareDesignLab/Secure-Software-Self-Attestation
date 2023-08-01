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
import { ControlAttestation, GroupInfo, Catalog } from '../models/catalogModel';

import { BehaviorSubject, Subject } from 'rxjs';
import { AssessmentPlanService } from './assessment-plan.service';
import { ChecklistItemComponent } from '../control/control.component';

const dela = (ms : number) => new Promise(res => setTimeout(res, ms))

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
  public neededControls: Set<string> = new Set<string>();
  public stagedJSON: any;


  private dynamicFormSubject: BehaviorSubject<AttestationComponent> = new BehaviorSubject<AttestationComponent>(new AttestationComponent(this, this.assessmentPlanService, true));
  public dynamicForm$ = this.dynamicFormSubject.asObservable();

  constructor(private assessmentPlanService: AssessmentPlanService) {}
  
  /**
   * Used in changing page content, should be called after updateDynamicForm
   */  
  refresh(){
      this.ComponentRefreshSource.next();
  }

  /**
   * Changes the visible form
   * @param form The form to display
   */
  updateDynamicForm(form: AttestationComponent) {
    this.dynamicFormSubject.next(form);
  }

  /**
   * Sets the deletion position
   * @param position The deletion position
   */
  setDeletionPosition(position: number){
    this.deletionPosition= position;
  }

  /**
   * Gets the data at a given position
   * @param position The position to get the data of
   * @returns The attestation Component at that position
   */
  getdata(position: number): AttestationComponent{
    return this.forms[position];
  }

  /**
   * Gets the currently visible attestation component
   * @returns The currently visible attestation component
   */
  get getCurrentForm(): AttestationComponent{
    return this.forms[this.viewPosition];
  }

  /**
   * Sets a given component to the view
   * @param position The position to set the view position of
   */
  setView(position: number){
    this.assessmentPlanService.setAttestationFocus(position);
    this.viewPosition = position;
  }

  /**
   * Returns the whole array of components
   */
  get getRawData(){
    return this.forms;
  }

  /**
   * Gets the currently viewed position
   * @returns The current component position
   */
  get getView(): number{
    return this.viewPosition;
  }

  /**
   * Gets the current deletion position
   * @returns the position to delete
   */
  get getDeletionPosition(): number{
    return this.deletionPosition;
  }

  /**
   * Adds a new form
   */
  addform(){
    this.assessmentPlanService.setAttestationFocus(this.forms.length);
    this.forms.push(new AttestationComponent(this, this.assessmentPlanService));
    let position = this.forms.length-1;
    this.forms[position].setPositionTag(this.tag);
    this.forms[position].setFormPosition(position);
    this.tag = this.tag + 1;
  }


  // Control Methods 

  /**
   * 
   * @param UID The uuid of the control to set up
   * @returns The relevant control info
   */
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

  /**
   * Updates the selection of a ControlInfo
   * @param UID The uid to modify the selection of
   * @param selection The new selection
   */
  updateControlSelection(UID: string, selection: string){
    const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    this.assessmentPlanService.setControlSelection(controlID, selection);
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.selection=selection
    }
    else{
      console.log("Something went wrong")
    }
  }

  /**
   * Saves an in-progress comment to the control info 
   * @param UID The uid of the control info to modify
   * @param comment The new comment
   */
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

  /**
   * Saves a final comment to the control info
   * @param UID The uid of the control info to modify
   * @param comment The new comment
   */
  finalizeControlComment(UID: string, comment: string){
    const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    this.assessmentPlanService.setControlComment(controlID, comment);

    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.finalized=true;
      temp.comment=comment;
    }
    else{
      console.log("Something went wrong")
    }
  }


  /**
   * Wipes the control comment for a control info
   * @param UID The control uuid to delete the comment of
   */
  deleteControlComment(UID: string){
    const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    this.assessmentPlanService.removeControlComment(controlID);

    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.comment = "";
      temp.finalized = false;
      this.assessmentPlanService.removeControlComment(UID);
    }
  }

  /**
   * Toggles whether or not the control sub-info is open
   * @param UID The control info uuid
   */
  toggleControlRollable(UID: string){
    let temp = this.controlMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }

  /**
   * Removes a given control
   * @param UID The uuid of the control to remove
   */
  removeControl(UID: string){
    let position = this.getdata(this.deletionPosition).getPositionTag;
    let temp = position + "-" + UID;
    this.controlMap.delete(temp);
  }

  // Group methods
  /**
   * Sets up a new group
   * @param UID The group uuid to set up
   * @returns The new groupInfo object
   */
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

  /**
   * Toggles whether or not a group is visible
   * @param UID the group to toggle
   */
  toggleGroupRollable(UID: string){
    let temp = this.groupMap.get(UID);
    if(temp!==undefined){
      temp.showRollable = !temp.showRollable;
    }
  }

   /**
   * Removes the selected group from the page
   * @param UID The group to remove
   */
  removeGroup(UID: string){
    let position = this.getdata(this.deletionPosition).getPositionTag;
    let temp = position + "-" + UID;
    this.groupMap.delete(temp);
  }

  async checkNeededControls() {
    await dela(100)
    let currentControls = this.assessmentPlanService.getActivePlan();
    currentControls["reviewed-controls"]["control-selections"].forEach((catalog) => {
      catalog["exclude-controls"]?.forEach((control) => {
        if (this.neededControls.delete(control["control-id"])) console.log("Resolved Control " + control["control-id"])
      })
    })
    if (this.neededControls.size === 0) {
      this.loadAttestationData();
    }
  }

  loadAttestationData() {
    let dialog = document.getElementById("needed-files-upload")
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
    let catalogs = this.stagedJSON["reviewed-controls"]["control-selections"]
    let props: any[] = [];
    /*let controls: String[] = [];
    let currentControls = this.assessmentPlanService.getActivePlan();
    currentControls["reviewed-controls"]["control-selections"].forEach((catalog) => {
      catalog["exclude-controls"]?.forEach((control) => {
        if (controls.push(control["control-id"])) console.log("Identified Control " + control["control-id"])
      })
    })*/
    console.log(catalogs);
    catalogs.forEach((catalog: any) => {
      props = props.concat(catalog["props"])
    })
    console.log(props)
    props.forEach((prop: any) => {
      if (prop["class"] === "Compliance Claim") {
        this.assessmentPlanService.setControlSelection(prop["name"], prop["value"]);
      }
    })
  }
}



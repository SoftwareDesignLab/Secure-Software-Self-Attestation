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
import { ContactService } from './contact.service';

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
  private tag: number;
  private viewPosition: number = -1;
  private deletionPosition: number = 0;
  public pageName: string = "Contact Info";
  public stagedJSON: any;
  public bypassComments: boolean = false;
  private displayIDMap!: Map<String, number>;
  private catalogPosition!: Map<String, number>;

  private dynamicFormSubject: BehaviorSubject<AttestationComponent> = new BehaviorSubject<AttestationComponent>(new AttestationComponent(this, this.assessmentPlanService, true));
  public dynamicForm$ = this.dynamicFormSubject.asObservable();

  constructor(private assessmentPlanService: AssessmentPlanService, private contactService: ContactService) {
    this.tag = 0;
  }
  
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
   * does not delete anything itself
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

  get getCurrentForm(){
    this.catalogPosition = this.forms[this.viewPosition].getCatalogPositions
    return this.forms[this.viewPosition];
  }

  getCatalogIndex(catalogUUID: string){
    return this.forms[this.viewPosition].getCatalogPositon(catalogUUID);
  }

  setView(position: number){
    this.assessmentPlanService.setAttestationFocus(position);
    this.displayIDMap=this.forms[position].displayIDMap;
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
   * Sets tag to be used for UID generations of a form
   * @returns 
   */
  setTag(){
    this.tag +=1;
    return this.tag;
  }

  /**
   * Adds a new form
   */
  addform(){
    this.assessmentPlanService.setAttestationFocus(this.forms.length);
    this.forms.push(new AttestationComponent(this, this.assessmentPlanService));
    let position = this.forms.length-1;
    this.forms[position].setFormPosition(position);
  }


  // Control Methods 


  /**
   * Checks if checklist compontent still exists on different attestation page
   * @param UID 
   * @returns True if it exists, false if it does not exists
   */
  validateUID(UID: string){
    let catalogUUID = this.uidToUuid(UID);
    if(this.catalogPosition.has(catalogUUID)){
      return true;
    } else {
      return false;
    }
  }

  /**
   * 
   * @param UID The uuid of the control to set up
   * @returns The relevant control info
   */
  setUpControl(UID: string): ControlAttestation | undefined{
    if(this.controlMap.has(UID)){
      return(this.controlMap.get(UID));
    }
    const controlID = UID.split("-").at(-1) || ""; // kind of hacky
    let displayID = this.dupIDCheck(controlID);
    let info = new ControlAttestation(displayID);
    this.controlMap.set(UID, info);
    
    let catalogUUID = this.uidToUuid(UID);
    let index = this.getCatalogIndex(catalogUUID);
    if (index !== undefined){
      this.assessmentPlanService.setControlSelection(info.displayID,info.selection, index)
    }
    else {
      console.warn("could not set up controlSelection in assessmentPlanService");
    }

    return info;
  }

  /**
   * Cheks if this ID has already been used in this Assessment Plan
   * @param controlID ID of the control being checked
   * @returns unique version of the ID given if its not unique
   */
  dupIDCheck(controlID: string): string{
      let displayID = controlID;
      // looks if a controlID has already been used
      if(this.displayIDMap.has(controlID)){
        let amount = this.displayIDMap.get(controlID);
        if(amount!=undefined){
          displayID = displayID + " (" +  this.displayIDMap.get(controlID) + ")";
          this.displayIDMap.set(controlID, amount+1);
          this.displayIDMap.set(displayID,1);
        } else {
          console.warn("undefined UID?");
          return controlID;
        }
      } else {
        this.displayIDMap.set(controlID, 1);
      }
      return displayID;
  }

  /**
   * Method for changing ID of control
   * @param UID Unique Identifier for this control
   * @param newDisplayID new Id that will be used for everything except UID
   * @param oldID  old ID that was being displayed
   * @returns  returns the newID, which is an acceptable version of NewDisplayID
   */
  setControlID(UID: string, newDisplayID: string, oldID: string): string{
    const catalogUUID = this.uidToUuid(UID);
    let index = this.getCatalogIndex(catalogUUID);
    let temp = this.controlMap.get(UID);
    if (temp !== undefined && index !== undefined){
      temp.displayID=newDisplayID;
      let catalogMap = this.assessmentPlanService.modifiedControlIds.get(this.getCurrentForm.getFormPosition);
      if (catalogMap === undefined) {
        catalogMap = new Map<String, Map<String, String>>();
        this.assessmentPlanService.modifiedControlIds.set(this.getCurrentForm.getFormPosition, catalogMap);
      }
      let idMap = catalogMap.get(catalogUUID);
      if (idMap === undefined) {
        idMap = new Map<String, String>();
        catalogMap.set(catalogUUID, idMap);
      }
      idMap.set(oldID, newDisplayID)
      return newDisplayID;
    }
    console.warn("Control ID Failed to changed")
    return oldID;
    }
    

  /**
   * Takes in an UID and reverses it back to its catalog uuid,
   * @param UID Unique identifier of the object being given
   * @returns catalogs uuid (string)
   */
  uidToUuid(UID: string){
    let temp = UID.split("-") || ""; // kind of hacky
    let catalogUUID = "";
    for (let i = 1; i < temp.length-1; i++) {
      catalogUUID = catalogUUID + "-" +temp[i]
    }
    return catalogUUID.substring(1);
  }

  /**
   * Updates the selection of a ControlInfo
   * @param UID The uid to modify the selection of
   * @param selection The new selection
   */
  updateControlSelection(UID: string, selection: string){
    const catalogUUID = this.uidToUuid(UID);
    let index = this.getCatalogIndex(catalogUUID);
    let temp = this.controlMap.get(UID);
    if(temp!==undefined && index !== undefined){
      this.assessmentPlanService.setControlSelection(temp.displayID, selection, index);
      temp.selection=selection
    }
    else{
      console.log("Unable to find index/control id while updating Selection");
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
      console.log("Unable to find index/control id while saving control comment");
    }
  }

  /**
   * Saves a final comment to the control info
   * @param UID The uid of the control info to modify
   * @param comment The new comment
   */
  finalizeControlComment(UID: string, comment: string){
    const catalogUUID = this.uidToUuid(UID);
    let index = this.getCatalogIndex(catalogUUID);


    let temp = this.controlMap.get(UID);
    if(temp!==undefined && index !== undefined){
      this.assessmentPlanService.setControlComment(temp.displayID, comment,index);
      temp.finalized=true;
      temp.comment=comment;
    }
    else{
      console.log("Unable to find index/control id while finalizing control comment");
    }
  }


  /**
   * Wipes the control comment for a control info
   * @param UID The control uuid to delete the comment of
   */
  deleteControlComment(UID: string){
    const catalogUUID = this.uidToUuid(UID);
    let index = this.getCatalogIndex(catalogUUID);

    let temp = this.controlMap.get(UID);
    if(temp!==undefined && index !== undefined){
      this.assessmentPlanService.removeControlComment(temp.displayID, index);
      temp.comment = "";
      temp.finalized = false;
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

  convertNaming(str: String) {
    switch (str) {
      case "yes": return "check";
      case "no": return "x";
      case "n/a": return "na";
      default: return str;
    }
  }

  interpretParties(soft: boolean): boolean {
    let parties = this.stagedJSON["assessment-plan"]["metadata"]["parties"];
    let companyStuff: JSON | undefined = undefined;
    let contactStuff: JSON | undefined = undefined;
    let differences = false;
    parties.forEach((party: any) => {
      if (party.type === "organization") companyStuff = party;
      if (party.type === "person") contactStuff = party;
    })
    
    if (companyStuff) {
      let data = new Map()
      if (this.contactService.companyName !== companyStuff["name"]) {
        if (this.contactService.companyName !== "") differences = true;
        if (!soft) {this.contactService.companyName = companyStuff["name"]; data.set("name", companyStuff["name"]);}
      }
      if (companyStuff["addresses"] && this.contactService.companyAddress1 !== companyStuff["addresses"][0]["addr-lines"][0]) {
        if (this.contactService.companyAddress1 !== "") differences = true
        if (!soft) {this.contactService.companyAddress1 = companyStuff["addresses"][0]["addr-lines"][0]; data.set("address1", this.contactService.companyAddress1);}
      }
      if (companyStuff["addresses"] && this.contactService.companyAddress2 !== companyStuff["addresses"][0]["addr-lines"][1]) {
        if (this.contactService.companyAddress2 !== "") differences = true
        if (!soft) {this.contactService.companyAddress2 = companyStuff["addresses"][0]["addr-lines"][1]; data.set("address2", this.contactService.companyAddress2);}
      }
      if (companyStuff["addresses"] && this.contactService.city !== companyStuff["addresses"][0]["city"]) {
        if (this.contactService.city !== "") differences = true
        if (!soft) {this.contactService.city = companyStuff["addresses"][0]["city"];  data.set("city", companyStuff["addresses"][0]["city"]);}
      }
      if (companyStuff["addresses"] && this.contactService.state !== companyStuff["addresses"][0]["state"]) {
        if (this.contactService.state !== "") differences = true
        if (!soft) {this.contactService.state = companyStuff["addresses"][0]["state"]; data.set("state", companyStuff["addresses"][0]["state"]);}
      }
      if (companyStuff["addresses"] && this.contactService.country !== companyStuff["addresses"][0]["country"]) {
        if (this.contactService.country !== "") differences = true
        if (!soft) {this.contactService.country = companyStuff["addresses"][0]["country"]; data.set("country", companyStuff["addresses"][0]["country"]);}
      }
      if (companyStuff["addresses"] && this.contactService.postalCode !== companyStuff["addresses"][0]["postal-code"]) {
        if (this.contactService.postalCode !== "") differences = true
        if (!soft) {this.contactService.postalCode = companyStuff["addresses"][0]["postal-code"]; data.set("postal", companyStuff["addresses"][0]["postal-code"]);}
      }
      if (companyStuff["props"]) {
        (companyStuff["props"] as any).forEach((prop: any) => {
          if (prop.name === "website") {
            if (prop.value !== this.contactService.website && this.contactService.website !== "") differences = true;
            if (!soft) {this.contactService.website = prop.value; data.set("website", prop.value);}
          }
        })
      }
      this.assessmentPlanService.updateProducerInfo(Object.fromEntries(data.entries()));
    }

    if (contactStuff) {
      let data = new Map();
      if (contactStuff["name"] && this.contactService.firstName !== (contactStuff["name"] as String).split(" ")[0]) {
        if (this.contactService.firstName !== "") differences = true;
        if (!soft) {this.contactService.firstName = (contactStuff["name"] as String).split(" ")[0]; data.set("name", contactStuff["name"]);}
      }
      if (contactStuff["name"] && this.contactService.lastName !== (contactStuff["name"] as String).split(" ")[1]) {
        if (this.contactService.lastName !== "") differences = true;
        if (!soft) {this.contactService.lastName = (contactStuff["name"] as String).split(" ")[1]; data.set("name", contactStuff["name"]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalAddress1 !== contactStuff["addresses"][0]["addr-lines"][0]) {
        if (this.contactService.personalAddress1 !== "") differences = true;
        if (!soft) {this.contactService.personalAddress1 = contactStuff["addresses"][0]["addr-lines"][0]; data.set("address1", contactStuff["addresses"][0]["addr-lines"][0]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalAddress2 !== contactStuff["addresses"][0]["addr-lines"][1]) {
        if (this.contactService.personalAddress2 !== "") differences = true;
        if (!soft) {this.contactService.personalAddress2 = contactStuff["addresses"][0]["addr-lines"][1]; data.set("address2", contactStuff["addresses"][0]["addr-lines"][1]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalCity !== contactStuff["addresses"][0]["city"]) {
        if (this.contactService.personalCity !== "") differences = true;
        if (!soft) {this.contactService.personalCity = contactStuff["addresses"][0]["city"]; data.set("city", contactStuff["addresses"][0]["city"]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalState !== contactStuff["addresses"][0]["state"]) {
        if (this.contactService.personalState !== "") differences = true;
        if (!soft) {this.contactService.personalState = contactStuff["addresses"][0]["state"]; data.set("state", contactStuff["addresses"][0]["state"]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalCountry !== contactStuff["addresses"][0]["country"]) {
        if (this.contactService.personalCountry !== "") differences = true;
        if (!soft) {this.contactService.personalCountry = contactStuff["addresses"][0]["country"]; data.set("country", contactStuff["addresses"][0]["country"]);}
      }
      if (contactStuff["addresses"] && this.contactService.personalPostal !== contactStuff["addresses"][0]["postal-code"]) {
        if (this.contactService.personalPostal !== "") differences = true;
        if (!soft) {this.contactService.personalPostal = contactStuff["addresses"][0]["postal-code"]; data.set("postal", contactStuff["addresses"][0]["postal-code"]);}
      }
      if (contactStuff["email-addresses"] && this.contactService.email !== contactStuff["email-addresses"][0]) {
        if (this.contactService.email !== "") differences = true;
        if (!soft) {this.contactService.email = contactStuff["email-addresses"][0]; data.set("email", contactStuff["email-addresses"][0]);}
      }
      if (contactStuff["telephone-numbers"] && this.contactService.phone !== contactStuff["telephone-numbers"][0]) {
        if (this.contactService.phone !== "") differences = true;
        if (!soft) {this.contactService.phone = contactStuff["telephone-numbers"][0]; data.set("phone", contactStuff["telephone-numbers"][0]);}
      }
      if (contactStuff["props"]) {
        (contactStuff["props"] as any).forEach((prop: any) => {
          if (prop.name === "title") {
            if (prop.value !== this.contactService.title && this.contactService.title !== "") differences = true;
            if (!soft) {this.contactService.title = prop.value; data.set("title", prop.value);}
          }
        })
      }
      this.assessmentPlanService.updateContactInfo(Object.fromEntries(data.entries()));
    }

    return differences;
  }

  async interpretSubjects() {
    let parties = this.stagedJSON["assessment-plan"]["assessment-subjects"][0]
    let props = parties["props"];
    let type = "no-selection"
    if (!props) return;
    props.forEach((prop: any) => {
      if (prop.class === "Attestation Type") type = prop.value;
    });
    if (type === "product") type = "product-line";
    if (type === "multi product") type = "multiple";
    let radio = document.getElementById(type);
    if (radio instanceof HTMLInputElement) {
      radio.click();
    }
    await dela(100);
    if (type === "multiple") {
      let button = document.getElementById("add-subject-row");
      for (let i=1, j=parties["include-subjects"].length; i < j; i++) {
        button?.click();
      }
      await dela(100);
    }
    if (type === "product-line" || type === "individual" || type === "multiple") {
      let includeSubjects = parties["include-subjects"]
      for (let i = 0, j=includeSubjects.length; i < j; i++) {
        let contentProps = includeSubjects[i]["props"];
        contentProps.forEach((prop: any) => {
          if (prop.name === "Product Name") {
            let name = document.getElementById("subject-name-" + i);
            if (name instanceof HTMLInputElement) {name.value = prop.value; name.click(); name.blur();};
          } else if (prop.name === "Version") {
            let version = document.getElementById("subject-version-" + i);
            if (version instanceof HTMLInputElement) {version.value = prop.value; version.click(); version.blur();}
          } else if (prop.name === "Date") {
            let date = document.getElementById("subject-date-" + i);
            if (date instanceof HTMLInputElement) {date.value = prop.value; date.click(); date.blur();}
          }
        });
      }
    }
  }

  loadAttestationData() {
    let dialog = document.getElementById("contact-dialog")
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
    let catalogs = this.stagedJSON["assessment-plan"]["reviewed-controls"]["control-selections"]
    let props: any[] = [];
    catalogs.forEach((catalog: any) => {
      props = props.concat(catalog["props"])
    })
    this.bypassComments = true;
    props.forEach((prop: any) => {
      if (prop["class"] === "Compliance Claim") {
        let controls = document.getElementsByClassName(prop["name"] + "-" + this.convertNaming(prop["value"]));
        for (let i = 0, len = controls.length; i < len; i++){
          let control = controls.item(i);
            if (control instanceof HTMLInputElement) control.click();
        }
      } else if (prop["class"] === "Attestation Claim") {
        this.getCurrentForm.getCatalogs.catalogs.forEach((catalog) => {
          catalog.groups.forEach((group) => {
            if (group.controls) {
              group.controls.forEach((control) => {
                if (control.id === prop["name"]) {
                  let uuid = this.getCurrentForm.getPositionTag + '-' + catalog.uuid + '-' + control.id;
                  this.assessmentPlanService.setControlComment(control.id, prop["value"]);
                  let temp = this.controlMap.get(uuid);
                  if (temp!==undefined){
                    temp.finalized=true;
                    temp.comment=prop["value"];
                  }
                }
              })
            }
          })
        })
      } else if (prop["class"] === "Display Name") {
        this.getCurrentForm.getCatalogs.catalogs.forEach((catalog) => {
          catalog.groups.forEach((group) => {
            if (group.controls) {
              group.controls.forEach((control) => {
                if (control.id === prop["name"]) {
                  let uuid = this.getCurrentForm.getPositionTag + '-' + catalog.uuid + '-' + control.id;
                  this.assessmentPlanService.setControlComment(control.id, prop["value"]);
                  let temp = this.controlMap.get(uuid);
                  if (temp!==undefined){
                    temp.displayID = this.setControlID(uuid, prop["value"], temp.oldDisplayId);
                    temp.oldDisplayId = temp.displayID;
                  }
                }
              });
            }
          });
        });
      }
    });
    this.bypassComments = false;
    this.refresh();
  }
}



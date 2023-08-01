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
import { Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { AttestationDataService } from '../services/attestation-data.service';
import { ControlAttestation } from '../models/catalogModel';
import { timeInterval } from 'rxjs';
import { AssessmentPlanService } from '../services/assessment-plan.service';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})


export class ChecklistItemComponent {
  @Input() id: any;
  @Input() title: any;
  @Input() class: any;
  @Input() params: any;
  @Input() parts: any;
  @Input() links: any;
  @Input() props: any;
  @Input() controls?: ChecklistItemComponent[];
  @Input() catalogUUID: any;
  @Output() update = new EventEmitter();
  selection: string = "no-selection";
  showRollable = false;
  info!: ControlAttestation; 
  UID: any; //Unique ID for this control for the program
  comment: string = "";
  popup: Boolean = false;
  finalized: Boolean = false;
  onPopup: Boolean = false;
  primed: Boolean = false;
  focused: Boolean = false;
  displayID: any;

  constructor(private attestationDataService: AttestationDataService, private changeDetectorRef: ChangeDetectorRef, 
    private assessmentPlanService: AssessmentPlanService){  }


  ngOnInit(){
    this.UID = this.attestationDataService.getCurrentForm.getPositionTag +
     '-' + this.catalogUUID + '-' + this.id
    this.info = this.attestationDataService.setUpControl(this.UID)!;
    this.selection= this.info.selection;
    this.comment = this.info.comment;
    this.finalized = this.info.finalized;
    this.showRollable = this.info.showRollable;
    this.displayID = this.info.displayID;
    let index = this.attestationDataService.getCatalogIndex(this.catalogUUID);
    if (index !== undefined){
      this.assessmentPlanService.setControlSelection(this.displayID,this.selection, index)
    }
    else {
      console.warn("could not set up controlSelection in assessmentPlanService");
    }
    
  }


  refresh() {
    // Perform any necessary data updates here

    // Trigger change detection to update the view
    this.UID = this.attestationDataService.getCurrentForm.getPositionTag +
     '-' + this.catalogUUID + '-' + this.id
    this.info = this.attestationDataService.setUpControl(this.UID)!;
    this.displayID= this.info.displayID;
    this.selection= this.info.selection;
    this.comment = this.info.comment;
    this.finalized = this.info.finalized;
    this.showRollable = this.info.showRollable;
    this.changeDetectorRef.detectChanges();
  }

  toggleRollable() {
    this.showRollable = !this.showRollable;
    this.attestationDataService.toggleControlRollable(this.UID);
  }

  getDescription() {
    if (this.props) {
      // props are objects. find the first prop that has the class "description"
      const descriptionProp = this.props.find((prop: any) => prop.class === 'Description');
      if (descriptionProp) return descriptionProp.value;
    }
    return undefined;
  }

  getExamples() {
    if (this.parts) {
      // parts are objects. find all parts that have the class "Example"
      return this.parts.filter((part: any) => part.part_class === 'Example');
    }
  }

  getReferences() {
    if (this.props) {
      // parts are objects. find all parts that have the class "Example"
      return this.props.filter((prop: any) => prop.property_class === 'Reference');
    }
  }

  isChecked(): boolean {
    return this.selection !== "no-selection";
  }

  select(option: string) {
    if (this.selection === "no-selection") {
      this.deploy();
    }
    this.changeSelection(option);
  }

  changeSelection(option: string) {
    if (this.selection === option) {
      this.selection = "no-selection";
    } else {
      this.selection = option;
    }
    this.attestationDataService.updateControlSelection(this.UID, this.selection);
  }

  save() {
    this.finalized = false;
    let text = document.getElementById("comment")
    if (text instanceof HTMLTextAreaElement)
      this.comment = text.value;
      this.attestationDataService.saveControlComment(this.UID, this.comment);
    this.cancel();
  }

  done() {
    this.finalized = true;
    let text = document.getElementById("comment")
    if (text instanceof HTMLTextAreaElement)
      this.comment = text.value;
      this.attestationDataService.finalizeControlComment(this.UID, this.comment);
    this.cancel();
  }

  cancel() {
    this.popup = false;
    this.primed = false;
    this.focused = false;
  }

  del() {
    this.comment = "";
    this.finalized = false;
    this.cancel();
    this.attestationDataService.deleteControlComment(this.UID);
  }

  deploy() {
    let active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur;
    }
    this.popup = true;
  }

  enter(loc: boolean) {
    this.onPopup = loc;
  }

  down() {
    if (!this.onPopup)
      this.primed = true;
  }

  up() {
    if (this.primed) {
      if (!this.onPopup) {
        this.cancel();
      } else {
        this.primed = false;
      }
    }
  }

  commentFocus() {
    if (this.focused) 
      return
    let comment = document.getElementById("comment");
    if (comment instanceof HTMLElement) {
      comment.focus();
      this.focused = true;
    }
  }
  get getID(){
    return this.id;
  }

  changeDisplayId(event: any){
    console.log("click");
    const oldID = this.id
    this.displayID = event.target.value;
    this.attestationDataService.setControlID(this.UID, this.displayID)
    console.log(oldID + this.id);
  }



}


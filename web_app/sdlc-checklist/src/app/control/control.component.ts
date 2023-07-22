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
import { AttestationDataService } from '../attestation-data.service';
import { ControlInfo } from '../oscalModel';
import { timeInterval } from 'rxjs';


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
  @Input() controls: any;
  @Input() catalogUUID: any;
  @Output() update = new EventEmitter();
  selection: String = "no-selection";
  showRollable = false;
  info!: ControlInfo; 
  UID: any; //Unique ID for this control for the program
  comment: String = "";
  finalized: Boolean = false;

  constructor(private attestationDataService: AttestationDataService, private changeDetectorRef: ChangeDetectorRef){  }

  ngOnInit(){
    this.UID = this.attestationDataService.getCurrentForm.getPositionTag +
     '-' + this.catalogUUID + '-' + this.id
    this.info = this.attestationDataService.setUpControl(this.UID)!;
    this.selection= this.info.selection;
    this.comment = this.info.comment;
    this.finalized = this.info.finalized;
    this.showRollable = this.info.showRollable;
    let dialog = document.getElementById("explanation-popup");
    if (dialog instanceof HTMLDialogElement)
      dialog.addEventListener('mousedown', (event: MouseEvent) => {
        if (dialog instanceof HTMLDialogElement) {
          let bounding = dialog.getBoundingClientRect();
          if (bounding.top > event.clientY || bounding.bottom < event.clientY || bounding.left > event.clientX || bounding.right < event.clientX)
            this.cancel();
        }
      });
  }

  refresh() {
    // Perform any necessary data updates here

    // Trigger change detection to update the view
    this.UID = this.attestationDataService.getCurrentForm.getPositionTag +
     '-' + this.catalogUUID + '-' + this.id
    this.info = this.attestationDataService.setUpControl(this.UID)!;
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

  openPopup() {
    let popup = document.getElementById("explanation-popup");
    if (popup instanceof HTMLDialogElement)
      popup.showModal();
  }

  closePopup() {
    let popup = document.getElementById("explanation-popup");
    if (popup instanceof HTMLDialogElement) 
      popup.close();
  }

  getComment(): String {
    let comment = document.getElementById("comment");
    if (comment instanceof HTMLTextAreaElement)
      return comment.value;
    return "";
  }

  select(option: string) {
    this.attestationDataService.updateControlSelection(this.UID, option);
    if (this.selection === "no-selection") {
      this.openPopup();
    }
    if (this.selection === option) {
      this.selection = "no-selection";
    } else {
      this.selection = option;
    }
  }

  done() {
    this.finalized = true;
    this.comment = this.getComment();
    this.closePopup();
  }

  save() {
    this.finalized = false;
    this.comment = this.getComment();
    this.closePopup();
  }

  cancel() {
    this.closePopup();
  }

  del() {
    this.finalized = false;
    this.comment = "";
    this.closePopup();
  }
}

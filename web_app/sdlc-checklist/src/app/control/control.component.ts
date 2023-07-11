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
import { Component, Input, Output, EventEmitter} from '@angular/core';
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
  @Output() update = new EventEmitter();
  selection: String = "no-selection";
  showRollable = false;
  @Input() uuid: any;
  info!: ControlInfo; 
  UID: any; //Unique ID for this control for the program
  comment: string = "";
  popup: Boolean = false;
  finalized: Boolean = false;
  onPopup: Boolean = false;
  primed: Boolean = false;

  constructor(private attestationDataService: AttestationDataService){
    this.UID = this.uuid + '-' + this.id
   
  }


  ngOnInit(){
    this.UID = this.uuid + '-' + this.id
    this.info = this.attestationDataService.setUpControl(this.UID)!;
    this.selection= this.info.selection;
  }

  toggleRollable() {
    this.showRollable = !this.showRollable;
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
    this.attestationDataService.updateControlSelection(this.UID, option);
    if (this.selection === "no-selection") {
      this.popup = true;
    }
    if (this.selection === option) {
      this.selection = "no-selection";
    } else {
      this.selection = option;
    }
  }

  save() {
    this.finalized = false;
    let text = document.getElementById("comment")
    if (text instanceof HTMLTextAreaElement)
      this.comment = text.value;
    this.cancel();
  }

  done() {
    this.finalized = true;
    let text = document.getElementById("comment")
    if (text instanceof HTMLTextAreaElement)
      this.comment = text.value;
    this.cancel();
  }

  cancel() {
    this.popup = false;
    this.primed = false;
  }

  del() {
    this.comment = "";
    this.finalized = false;
    this.cancel();
  }

  deploy() {
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
  
}
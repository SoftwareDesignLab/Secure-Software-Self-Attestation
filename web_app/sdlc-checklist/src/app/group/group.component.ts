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
import { Component, Input, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import { AttestationDataService } from '../services/attestation-data.service';
import { Control, Group, Result } from '../models/attestationModel';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() group: Group;
  title: string;
  id: string;
  catalogUUID: string;
  controls: Control[];
  showComponents = true;

  constructor(private attestationDataService: AttestationDataService){}

  ngOnInit(){
    this.title = this.group.title;
    this.id = this.group.id;
    this.catalogUUID = this.group.catalogUUID;
    this.controls = this.group.controls;
    this.showComponents = this.group.expanded;
    this.group.observableExpanded.subscribe((value) => {this.showComponents = value});
  }

  toggleComponents() {
    this.group.toggleExpansion();
  }

  setComponents(truth: boolean) {
    this.group.expanded = truth;
  }

  hideChildRollable() {
    this.controls.forEach((control) => control.expanded = false);
  }

  areAllChildrenChecked(): boolean {
    return -1 === this.controls.findIndex((control) => {control.result === Result.blank})
  }

  setAllChildrenSelection(selection: string): void {
    let result = Result.blank;
    switch (selection) {
      case "check": case "yes": result = Result.yes; break;
      case "x": case "no": result = Result.no; break;
      case "na": case "n/a": result = Result.na; break;
    }
    if (result !== Result.blank && this.controls.findIndex((control) => {control.result !== result}) === -1) result = Result.blank;
    this.controls.forEach((control) => {control.result = result});
  }
}

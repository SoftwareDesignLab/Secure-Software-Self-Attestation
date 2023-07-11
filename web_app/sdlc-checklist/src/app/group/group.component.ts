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
import { Component, Input, ViewChildren, QueryList} from '@angular/core';
import { ChecklistItemComponent } from '../control/control.component'

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() id: any;
  @Input() title: any;
  @Input() description: any;
  @Input() controls: any;
  @Input() catalogUUID: any;
  @ViewChildren(ChecklistItemComponent) childComponents!: QueryList<ChecklistItemComponent>;
  showComponents = true;
  UID: any;  //Unique ID for this control for the program


  ngOnInit(){
    this.UID = this.catalogUUID + '-' + this.id
  }

  toggleComponents() {
    this.showComponents = !this.showComponents;
    if (!this.showComponents) {
      this.hideChildRollable();
    }
  }

  setComponents(truth: boolean) {
    if (!truth) {
      this.hideChildRollable();
    }
    this.showComponents = truth;
  }

  hideChildRollable() {
    this.childComponents.forEach((child) => {
      child.showRollable = false;
    })
  }

  areAllChildrenChecked(): boolean {
    if (this.childComponents === undefined) {return false;}
    for (let i = this.childComponents.length - 1; i>=0; i--) {
      let child = this.childComponents.get(i);
      if (child instanceof ChecklistItemComponent) {
        if (!child.isChecked()) {
          return false;
        }
      }
    }
    return true;
  }

  deselectAll(selection: string){
    if (this.childComponents === undefined) {return true;}
    for (let i = this.childComponents.length - 1; i>=0; i--) {
      let child = this.childComponents.get(i);
      if (child instanceof ChecklistItemComponent) {
        if (child.selection != selection) {
          return true;
        }
      }
    }
    return false;
  }

  setAllChildrenSelection(selection: string): void {
    if(this.deselectAll(selection)){
      this.childComponents.forEach((child) => {
        child.selection = selection;
      })
    }
    else{
      this.childComponents.forEach((child) => {
        child.selection = "no-selection";
      })
    }
  }
}

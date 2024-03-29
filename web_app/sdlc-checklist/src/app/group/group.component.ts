/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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
import { Component, Input } from '@angular/core';
import { Control, Result } from '../models/attestationModel';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() group: any;

  /**
   * Hides the rollable components of all child controls
   */
  hideChildRollable() {
    this.group.controls.forEach((control: Control) => control.expanded = false);
  }

  /**
   * Determines whether all children are checked
   * @returns Whether all children are checked
   */
  areAllChildrenChecked(): boolean {
    return this.group.controls.reduce((truth: boolean, control: Control): boolean => { return truth && control.result !== Result.blank}, true)
  }

  /**
   * Sets all children to the selection, or sets them all to blank if they all were the selection already
   * @param selection What to set the chilren to
   */
  setAllChildrenSelection(selection: string): void {
    let result = Result.blank;
    switch (selection) {
      case "check": case "yes": result = Result.yes; break;
      case "x": case "no": result = Result.no; break;
      case "na": case "n/a": result = Result.na; break;
    }
    if (result !== Result.blank && this.group.controls.findIndex((control: Control) => {return control.result !== result}) === -1) result = Result.blank;
    this.group.controls.forEach((control: Control) => {control.result = result});
  }
}

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
import { Component, Input } from '@angular/core';
import { AttestationDataService } from '../services/attestation-data.service';
import { Control, Result } from '../models/attestationModel';
import { Prop } from '../models/propertyModel';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ChecklistItemComponent {
  @Input() control: any;
  popup: boolean = false;
  clickOutOfWindow: boolean = false;

  constructor(private attestationDataService: AttestationDataService){  }

  isChecked(): boolean {
    return this.control.result !== Result.blank;
  }

  isSelected(option: string): boolean {
    return (option === "check" && this.control.result === Result.yes) || (option === "x" && this.control.result === Result.no) || (option === "na" && this.control.result === Result.na);
  }

  select(option: string) {
    let result = Result.blank;
    switch (option) {
      case "check": case "yes": result = Result.yes; break;
      case "x": case "no": result = Result.no; break;
      case "na": case "n/a": result = Result.na; break;
    }
    if (result === this.control.result) result = Result.blank;
    this.control.result = result;
  }

  save() {
    let comment = document.getElementById("comment")
    if (comment instanceof HTMLTextAreaElement) {
      this.control.inProgressComment(comment.value);
    }
    this.cancel();
  }

  done() {
    let comment = document.getElementById("comment")
    if (comment instanceof HTMLTextAreaElement) {
      this.control.finalizeComment(comment.value);
    }
    this.cancel();
  }

  cancel() {
    this.popup = false;
  }

  del() {
    this.control.comment = "";
    this.control.commentFinalized = false;
    this.cancel();
  }

  deploy() {
    this.popup = true;
  }

  down(event: MouseEvent) {
    let popup = document.getElementById("popup");
    if (popup instanceof HTMLDivElement) {
      if (popup.clientLeft > event.clientX  || event.clientX > popup.clientLeft + popup.clientWidth || 
          event.clientY < popup.clientTop || event.clientY + popup.clientTop + popup.clientHeight) {
        this.clickOutOfWindow = true;
      }
    }
  }

  up(event: MouseEvent) {
    if (!this.clickOutOfWindow) { return; }
    this.clickOutOfWindow = false;
    let popup = document.getElementById("popup");
    if (popup instanceof HTMLDivElement) {
      if (popup.clientLeft > event.clientX  || event.clientX > popup.clientLeft + popup.clientWidth || 
          event.clientY < popup.clientTop || event.clientY + popup.clientTop + popup.clientHeight) {
        this.cancel();
      }
    }
  }

  commentFocus() {
    document.getElementById("comment")?.focus();
  }
}


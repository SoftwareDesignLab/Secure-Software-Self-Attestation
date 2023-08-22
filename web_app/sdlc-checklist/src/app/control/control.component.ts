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
import { Result } from '../models/attestationModel';
import { AssessmentPlanService } from '../services/assessment-plan.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ChecklistItemComponent {
  @Input() control: any;
  clickOutOfWindow: boolean = false;

  constructor(private assessmentPlanService: AssessmentPlanService) {}

  /**
   * Determines if the given option is the one checked
   * @param option The option to look at
   * @returns Whether or not that option is checked
   */
  isSelected(option: string): boolean {
    return (option === "check" && this.control.result === Result.yes) || (option === "x" && this.control.result === Result.no) || (option === "na" && this.control.result === Result.na);
  }

  /**
   * Selects the provided option, or deselects it if it was already selected
   * @param option The option that was clicked
   */
  select(option: string) {
    if (this.control.result === Result.blank) this.deploy();
    let result = Result.blank;
    switch (option) {
      case "check": case "yes": result = Result.yes; break;
      case "x": case "no": result = Result.no; break;
      case "na": case "n/a": result = Result.na; break;
    }
    if (result === this.control.result) result = Result.blank;
    this.control.result = result;
  }

  /**
   * Saves the current comment as in-progress and closes the dialog
   */
  save() {
    let comment = document.getElementById("comment-" + this.control.uid)
    if (comment instanceof HTMLTextAreaElement) {
      this.control.inProgressComment(comment.value);
    }
    this.cancel();
  }

  /**
   * Saves the current comment as final and closes the dialog
   */
  done() {
    let comment = document.getElementById("comment-" + this.control.uid)
    if (comment instanceof HTMLTextAreaElement) {
      this.control.finalizeComment(comment.value);
    }
    this.cancel();
  }

  /**
   * Closes the comment dialog
   */
  cancel() {
    (document.getElementById("comment-popup-" + this.control.uid) as HTMLDialogElement)?.close()
  }

  /**
   * Deletes the comment and closes the dialog
   */
  del() {
    this.control.comment = "";
    this.control.commentFinalized = false;
    this.cancel();
  }

  /**
   * Opens the comment dialog
   */
  deploy() {
    (document.getElementById("comment-popup-" + this.control.uid) as HTMLDialogElement)?.showModal();
    (document.getElementById("comment-" + this.control.uid) as HTMLTextAreaElement).value = this.control.comment;
  }

  /**
   * Sets the focus onto the textarea
   */
  commentFocus() {
    document.getElementById("comment-" + this.control.uid)?.focus();
  }

  /**
   * Closes the comment dialog if the cursor clicked on the gray background
   * @param event The cursor click event
   */
  clicked(event: MouseEvent) {
    let dialog = document.getElementById("comment-popup-" + this.control.uid) as HTMLDialogElement;
    if (0 > event.offsetX || dialog.clientWidth < event.offsetX || 0 > event.offsetY || dialog.clientHeight < event.offsetY) {
      dialog.close();
    }
  }
}


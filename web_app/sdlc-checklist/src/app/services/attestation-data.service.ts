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
import { Form } from '../models/attestationModel';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {
  forms: Form[] = [];
  #activeForm: BehaviorSubject<Form | undefined> = new BehaviorSubject<Form | undefined>(undefined);

  /**
   * Creates a new form and adds it to forms
   * @returns The new form
   */
  createNewForm() {
    let newForm = new Form();
    this.forms.push(newForm);
    this.#activeForm.next(newForm)
    return newForm
  }

  deleteForm(uuid?: string) {
    let form: Form | undefined
    if (uuid) {
      form = this.forms.find((form) => (form.uuid === uuid))
    } else {
      form = this.activeForm;
    }
    if (form) {
      this.forms.splice(this.forms.findIndex(del => del === form), 1)
    }
  }

  /**
   * Gets the active form
   * @returns The active form's list of catalogs
   */
  get activeForm(): Form | undefined { return this.#activeForm.getValue(); }
  get observableActiveForm(): BehaviorSubject<Form | undefined> { return this.#activeForm; }
  set activeForm(form: Form | undefined) {this.#activeForm.next(form); }
}
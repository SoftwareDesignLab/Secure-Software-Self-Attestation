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
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const dela = (ms : number) => new Promise(res => setTimeout(res, ms))

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {
  forms: Form[] = [];
  #activeForm: BehaviorSubject<Form | undefined> = new BehaviorSubject<Form | undefined>(undefined);

  constructor(private router: Router) {}

  /**
   * Creates a new form and adds it to forms
   * @returns The new form
   */
  createNewForm(startingCatalog: boolean = true) {
    let newForm = new Form(startingCatalog);
    this.forms.push(newForm);
    this.#activeForm.next(newForm)
    return newForm
  }

  /**
   * Deletes the given form
   * @param uuid The uuid of the form to delete (defaults to the active form if left blank)
   */
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
    if (form === this.activeForm) {
      this.router.navigate(['contact-info']);
      this.activeForm = undefined;
    }
  }

  /**
   * Changes the current page
   * @param page The page name to change to
   * @param fragment The fragment identifier to scroll to
   */
  async changePage(page: string, fragment?: string){
    if (page === "contact-info") { this.activeForm = undefined; }
    if (fragment) {
      this.router.navigate([page], {fragment: fragment});
      await dela(50);
      let parent = document.getElementById(fragment);
      if (parent instanceof HTMLElement) {
        let newFocus = this.findFirstLandingChildr(parent);
        if (newFocus instanceof HTMLElement) {
          newFocus.focus();
        }
      }
    } else {
      this.router.navigate([page])
    }
  }

  /**
   * Recursively identifies the first descendant element to have the class "landing"
   * @param parent The parent to search from
   * @returns The element with "landing", null if none exists
   */
  findFirstLandingChildr(parent: HTMLElement): HTMLElement | null {
    let children = parent.children;
    for (let i = 0, max = children.length; i < max; i++) {
      let child = children[i];
      if (child instanceof HTMLElement) {
        if (child.classList.contains('landing'))
          return child;
      }
      if (child instanceof HTMLElement) {
        let recurse = this.findFirstLandingChildr(child);
        if (recurse instanceof HTMLElement) {
          return recurse;
        }
      }
    }
    return null;
  }

  /**
   * Changes the current page to attestation-form and changes the active form
   * @param form The form to change to
   * @param fragment (optional) The fragment to scroll to
   */
  changeAttestation(form: Form, fragment?: string) {
    this.activeForm = form;
    this.changePage('attestation-form', fragment);
  }

  /**
   * Gets the active form
   * @returns The active form's list of catalogs
   */
  get activeForm(): Form | undefined { return this.#activeForm.getValue(); }
  get observableActiveForm(): BehaviorSubject<Form | undefined> { return this.#activeForm; }
  set activeForm(form: Form | undefined) {this.#activeForm.next(form); }
}
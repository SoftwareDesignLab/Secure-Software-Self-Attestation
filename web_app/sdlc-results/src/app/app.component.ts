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
import { Component } from '@angular/core';
import { AssessmentResults } from './resultsModel';

const dela = (ms : number) => new Promise(res => setTimeout(res, ms))

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  assessmentResults: AssessmentResults | undefined;
  showFullFooter: boolean = false;
  showNav = false;
  poamMode = false;
  termsScrolled = false;
  termsAccepted = false;

  ngOnInit() {
    let dialog = document.getElementById("terms-and-conditions");
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
      });
    } 
  }

  onFileSelected(jsonData: any): void { //TODO jsonData should be of type Catalog
    if (!this.termsAccepted) {
      let dialog = document.getElementById("terms-and-conditions");
      if (dialog instanceof HTMLDialogElement) {
        dialog.showModal();
      } else {
        alert("Please refresh the page and click the accept button on terms and conditions")
      }
      return
    }
    this.assessmentResults = jsonData["assessment-results"];

  }

  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  toggleNav(): void {
    this.showNav = !this.showNav;
    let nav = document.getElementById('nav');
    if (nav instanceof HTMLElement) {
      if (this.showNav) {
        nav.classList.add('nav-opening');
        nav.classList.remove('nav-closing');
      } else {
        nav.classList.add('nav-closing');
        nav.classList.remove('nav-opening');
      }
    }
  }

  poam(state: boolean): void {
    this.toggleNav();
    this.poamMode = state;
  }

  async scrolledDown() {
    await dela(100);
    if (this.termsScrolled)
      return
    let scrollBox = document.getElementById("terms-and-conditions-scroll-box");
    if (scrollBox instanceof HTMLDivElement) {
      let full = scrollBox.scrollHeight;
      let above = scrollBox.scrollTop;
      let bellow = scrollBox.clientHeight;
      this.termsScrolled = full - 10 < above + bellow;
    }
  }

  alert(message: any): void {
    alert(message);
  }

  accept(): void {
    this.termsAccepted = true;
  }
}

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
import { Component } from '@angular/core';
import { AssessmentResults, Attestation } from './resultsModel';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  assessmentResults: AssessmentResults | undefined;
  relevantCatalogs: any[] = [];
  showFullFooter: boolean = false;
  showNav = false;
  showDashboard = true;
  dropdown = false;
  attestationPointer: Attestation | undefined = undefined;
  attestationTitles: string[] = []; //hacky

  onFileSelected(jsonData: any): void { //TODO jsonData should be of type Catalog
    this.assessmentResults = jsonData["assessment-results"];
    this.relevantCatalogs = jsonData["catalogs"];
  }

  assessmentResultsLoaded(): boolean {
    return this.assessmentResults !== undefined;
  }

  getAttestations(): Attestation[] {
    if (this.assessmentResults === undefined) return [];
    let attestations = this.assessmentResults.results[0].attestations ?? [];
    //hacky
    this.attestationTitles = attestations.map((attestation) => attestation.parts.find((part) => part.name === "Attestation Title")?.prose ?? "UNNAMED_ATTESTATION");
    return attestations;
  }

  uniqueCatalogs() {
    // filter all relevantCatalogs that don't have a unique name at relevantCatlalog[i].metadata.name
    let uniqueCatalogs = [];
    let catalogNames: any[] = [];
    for (let i = 0; i < this.relevantCatalogs.length; i++) {
      if (!catalogNames.includes(this.relevantCatalogs[i].metadata.title)) {
        catalogNames.push(this.relevantCatalogs[i].metadata.title);
        uniqueCatalogs.push(this.relevantCatalogs[i]);
      }
    }
    return uniqueCatalogs;
  }

  setAttestationPointer(index: number): void {
    // console.log(index)
    try {
      this.attestationPointer = this.getAttestations()[index];
      this.showDashboard = false;
    } catch (e) {
      this.attestationPointer = undefined;
      console.log(e);
    }
  }

  toggleFooter() {
    this.showFullFooter = !this.showFullFooter;
  }

  toggleAttestationTree(): void {
    this.dropdown = !this.dropdown;
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

  showAttestationDashboard(): void {
    this.showDashboard = true;
    this.attestationPointer = undefined;
  }
}

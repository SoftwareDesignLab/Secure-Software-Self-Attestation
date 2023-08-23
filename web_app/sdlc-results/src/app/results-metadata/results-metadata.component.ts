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
import { Person, Metadata, Organization } from '../models/contactModel';
import { AttestationDataService } from '../services/attestation-data.service';

@Component({
  selector: 'app-results-metadata',
  templateUrl: './results-metadata.component.html',
  styleUrls: ['./results-metadata.component.css']
})
export class ResultsMetadataComponent {
  metadata: Metadata | undefined;
  org: Organization | undefined;
  person: Person | undefined;
  title: string | undefined;

  constructor( attestationDataService: AttestationDataService ) {
    this.metadata = attestationDataService.form?.metadata;
    this.title = attestationDataService.form?.name;
    this.org = this.metadata?.organization;
    this.person = this.metadata?.person;
    attestationDataService.observableForm.subscribe((form) => {
      this.metadata = form?.metadata;
      this.org = form?.metadata.organization;
      this.person = form?.metadata.person;
      this.title = form?.name;
    })
  }
}

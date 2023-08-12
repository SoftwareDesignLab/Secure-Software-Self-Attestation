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


import { saveAs } from 'file-saver';
import { Component, ViewChildren, ViewChild, QueryList, HostListener } from '@angular/core';
import { GroupComponent } from '../group/group.component';
import catalog from '../defaultCatalog';
import { CatalogProcessingComponent } from '../catalog-processing/catalog-processing.component';

import { AttestationDataService } from '../services/attestation-data.service';
import { attestationComment } from '../models/attestationForm';
import { AttestationComponent } from '../attestation/attestation.component';
import { AssessmentPlanService } from '../services/assessment-plan.service';
import { ContactService } from '../services/contact.service';
import { Catalog, Form } from '../models/attestationModel';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-attestation-page',
  templateUrl: './attestation-page.component.html',
  styleUrls: ['./attestation-page.component.css']
})
export class AttestationPageComponent {

  form: Form | undefined;
  catalogs: Map<string, Catalog>;
  name: string;

  constructor(private attestationDataService: AttestationDataService) {
    this.form = this.attestationDataService.activeForm;
    this.attestationDataService.observableActiveForm.subscribe((form) => this.form = form);
  }

  ngOnInit() {
    if (this.form !== undefined) {
      this.name = this.form.name;
      this.form.observableName.subscribe((name) => this.name = name);
      this.catalogs = this.form.catalogMap;
      this.form.observableCatalogMap.subscribe((catalogMap) => this.catalogs = catalogMap);
    }
  }
}

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
import { Attestation, Result, getControlCatalogFromReviewedControls } from '../resultsModel';

interface ExtraData {
  [key: string]: any;
}

interface ControlResults {
  fullName: string;
  compliance: boolean | undefined;
  explanation: string | undefined;
  extra: ExtraData;
}

interface ControlDict {
  [key: string]: ControlResults;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  // @Input() result: Result = {} as Result;
  @Input() attestation: Attestation = {} as Attestation;
  catalogName: string = "Not associated with a catalog";
  links: string[] = [];
  controls: ControlDict = {};
  subjects: string[] = [];

  // TODO inefficient to call this every time anything changes
  ngOnChanges(): void {
    this.controls = {};
    this.subjects = [];
    if (this.attestation) {
      // console.log(this.attestation)
      // this.catalogName = getControlCatalogFromReviewedControls(this.result['reviewed-controls']);
      // if (this.result['reviewed-controls'].links){
      //   this.links = this.result['reviewed-controls'].links.map((link: any) => link.href);
      // }
          for (const part of this.attestation.parts.filter((p) => p.class !== "Attestation Metadata")) {
            if (!this.controls[part.name]) {
              this.controls[part.name] = {} as ControlResults;
              this.controls[part.name].extra = {} as ExtraData;
            }
            if (part.props) {
              this.controls[part.name].fullName = part.props.find((prop: any) => prop.name === "Control Name")?.value || part.title;
            }
            if (part.class === "Compliance") {
              this.controls[part.name].compliance = part.prose === "Compliant";
            }
            else if (part.class === "Explanation") {
              this.controls[part.name].explanation = part.prose;
            }
            else {
              this.controls[part.name].extra[part.class] = part.prose;
            }
          }
          for (const part of this.attestation.parts.filter((p) => p.name === "Attestation Subject")) {
            this.subjects.push(part.prose);
          }
        }
    }

    getSubjects(): string[] {
      if (this.subjects.length === 0) return ["Company-Wide"];
      return this.subjects;
    }
  }

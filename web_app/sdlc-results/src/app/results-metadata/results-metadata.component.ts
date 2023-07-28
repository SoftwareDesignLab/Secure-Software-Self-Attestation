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
import { ResultModelService, Metadata } from '../resultsModel';

@Component({
  selector: 'app-results-metadata',
  templateUrl: './results-metadata.component.html',
  styleUrls: ['./results-metadata.component.css']
})
export class ResultsMetadataComponent {
  public metadata: Metadata | null = null;
  constructor( public resultModelService: ResultModelService) {
    let metadata = resultModelService.assessmentResult?.metadata;
    if (metadata)
      this.metadata = metadata;
  }

  getAttribute(attribute: string): String {
    if (this.metadata !== null) {
      let value = "";
      switch (attribute) {
        case "title": value = this.metadata.title; break;
        case "version": value = this.metadata.version; break;
        case "last-modified": value = this.metadata["last-modified"]; break;
        case "oscal-version": value = this.metadata["oscal-version"]; break;
        case "published": value = this.metadata.published; break;
      }
      return value;
    }
    return "";
  }
}

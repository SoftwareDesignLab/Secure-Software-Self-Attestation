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
export interface Control {
  "control-id": string;
}

export interface ControlSelection {
  "include-all": object | undefined;
  "include-controls": Control[];
}

export interface Links {
  href: string;
}

export interface Props {
  name: string;
  value: string;
}

export interface Parts {
    name: string;
    class: string;
    title: string;
    prose: string;
    props: Props[];
}

export interface Attestation {
    "responsible-parties": object[]; //TODO define this type
    parts: Parts[];
}

export interface ReviewedControls {
  props: Props[];
  links: Links[];
  "control-selections": ControlSelection[];
}

export interface Result {
  uuid: string;
  title: string;
  description: string;
  start: string;
  "reviewed-controls": ReviewedControls;
  attestations: Attestation[];
}

export interface Metadata {
  title: string;
  "last-modified": string;
  version: string;
  "oscal-version": string;
}

export interface AssessmentResults {
  uuid: string;
  metadata: Metadata;
  "import-ap": object;
  results: Result[];
}

export function getControlCatalogFromReviewedControls(reviewedControls: ReviewedControls): string {
  // find the prop with the name "Catalog Name" and return its value
  const catalogNameProp = reviewedControls.props.find((prop) => prop.name === "Catalog Name");
  if (catalogNameProp) {
    return catalogNameProp.value;
  }
  return "";
}
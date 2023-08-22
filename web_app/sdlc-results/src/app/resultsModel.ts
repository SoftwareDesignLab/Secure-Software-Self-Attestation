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

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResultModelService {
  #assessmentResult: BehaviorSubject<AssessmentResult | null> = new BehaviorSubject<AssessmentResult | null>(null);

  get assessmentResult(): AssessmentResult | null { return this.#assessmentResult.getValue(); }
  get observableAssessmentResult(): BehaviorSubject<AssessmentResult | null> { return this.#assessmentResult; }
  set assessmentResult(assessmentResult: AssessmentResult | null) { this.#assessmentResult.next(assessmentResult); }
}

export class AssessmentResult {
  "assessment-plan": AssessmentPlan = new AssessmentPlan();
  catalogs: Catalog[] = [];

  constructor(json: JSON) {
    Object.assign(this, json);
    this.catalogs = this.catalogs.map((catalog) => {return new Catalog(catalog)});
    this["assessment-plan"] = new AssessmentPlan(this["assessment-plan"]);
    this.catalogs.forEach((catalog) => {this["assessment-plan"].catalogs.set(catalog.uuid, catalog)});
    this["assessment-plan"].loadCatalogData(json["assessment-plan"]);
  }
}

export class AssessmentPlan {
  uuid: string = "";
  metadata: Metadata = new Metadata();
  "import-ssp": object = {};
  catalogs: Map<string, Catalog> = new Map<string, Catalog>();
  //"assessment-subjects": Subject[] = [];

  constructor(json?: any) {
    Object.assign(this, json);
    this.metadata = new Metadata(this.metadata);
  }

  loadCatalogData(json: any) {
    
  }
}

export class Metadata {
  public title: string = "";
  "last-modified": string = "";
  version: string = "";
  "oscal-version": string = "";
  published: string = "";
  parties: Party[] = [];

  constructor(json?: any) {
    Object.assign(this, json);
    this.parties = this.parties.map((party) => {
      if (party.type === "organization")
        return new Organization(party);
      if (party.type === "person")
        return new Contact(party);
      return new Party(party);
    })
  }
}

export class Party {
  uuid: string = "";
  type: string = "";
  name: string = "";
  addresses: Address[] = [];
  props: Prop[] = [];

  constructor(json?: any) {
    Object.assign(this, json);
    this.addresses = this.addresses.map((address) => {return new Address(address)})
    this.props = this.props.map((prop) => {return new Prop(prop)})
  }
}

export class Organization extends Party {
  links: Link[] = [];

  constructor(json?: any) {
    super();
    Object.assign(this, json);
    this.addresses = this.addresses.map((address) => {return new Address(address)})
    this.props = this.props.map((prop) => {return new Prop(prop)})
    this.links = this.links.map((link: any) => {return new Link(link)});
  }
}

export class Contact extends Party {
  "email-addresses": string[] = [];
  "telephone-numbers": string[] = [];

  constructor(json?: any) {
    super();
    Object.assign(this, json);
    this.addresses = this.addresses.map((address) => {return new Address(address)})
    this.props = this.props.map((prop) => {return new Prop(prop)})
  }

  getProperName() {
    let title = "";
    this.props.forEach((prop) => {if (prop.class === "Contact Info" && prop.name === "title") title = prop.value;});
    if (title !== "")
      return capitalize(title + " " + this.name);
    return capitalize(this.name);
  }
}

export class Address {
  "addr-lines": string[] = [];
  city: string = "";
  state: string = "Default";
  "postal-code": string = "";
  country: string = "";

  constructor(json?: any) {
    Object.assign(this, json);
  }

  public getAddressAsString(): String {
    let addressString = this['addr-lines'].map((addressLine) => {return addressLine}).join(", ") + ", ";
    addressString += this.city + ", ";
    if (this.state) 
      addressString += this.state + ", ";
    addressString += this.country + ", ";
    addressString += this['postal-code'];
    return capitalize(addressString);
  }
}

export class Prop {
  name: string = "";
  value: string = "";
  class: string = "";

  constructor(json: any) {
    Object.assign(this, json);
  }
}

export class Link {
  href: string = "";
  rel: string = "";

  constructor(json: any) {
    Object.assign(this, json);
  }

  getLinkAsString() {
    return this.rel.charAt(0).toUpperCase() + this.rel.slice(1) + ": " + this.href;
  }

  getLinkAsDisplay(): {"label": string, "link": string} {
    return {"label": capitalize(this.rel), "link":this.href}
  }
}

function capitalize(str: String): string {
  return str.split(" ").map((word) => {return word.charAt(0).toUpperCase() + word.slice(1)}).join(" ");
}

export class Catalog {
  metadata: CatalogMetadata = new CatalogMetadata();
  groups: Group[] = [];
  uuid: string = "";
  
  constructor(json?: any) {
    Object.assign(this, json);
    this.metadata = new CatalogMetadata(this.metadata);
    this.groups = this.groups.map((group) => {return new Group(group)});
  }
}

export class CatalogMetadata {
  title: string = "";
  'last-modified': string = "";
  published: string = "";
  'oscal-version': string ="";
  version: string = "";

  constructor(json?: any) {
    Object.assign(this, json);
  }
}

export class Group {
  id: string = "";
  title: string = "";
  controls: Control[] = [];
  groups: Group[] = [];

  constructor(json?: any) {
    Object.assign(this, json);
    this.controls = this.controls.map((control) => {return new Control(control)});
    this.groups = this.groups.map((group) => {return new Group(group)});
  }
}

export class Control {
  id: string = "";
  title: string = "";
  props: Prop[] = [];
  parts: Part[] = [];
  controls: Control[] = [];
  result: Result = Result.blank;
  comment: string = "";

  constructor(json?: any) {
    Object.assign(this, json)
    this.props = this.props.map((prop) => {return new Prop(prop)});
    this.controls = this.controls.map((control) => {return new Control(control)});
  }

  get resultAsAlt(): string {
    switch (this.result) {
      case Result.yes: return "Compliant"
      case Result.no: return "Non-compliant"
      case Result.na: return "Not Applicable"
      default: return "Blank"
    }
  }

  get resultAsFilename(): string {
    switch (this.result) {
      case Result.yes: return "/assets/check.png"
      case Result.no: return "/assets/x.png"
      case Result.na: return "/assets/na.png"
      default: return "Blank"
    }
  }

  included(): boolean {
    return this.result !== Result.blank;
  }
}

export interface Part {
}

export enum Result {
  yes,
  no,
  na,
  blank
}





/*
export interface Part {
    name: string;
    class: string;
    title: string;
    prose: string;
    props: Prop[];
}

export interface Result {
  uuid: string;
  title: string;
  description: string;
  start: string;
  "reviewed-controls": ReviewedControls;
  attestations: Attestation[];
}

export interface Attestation {
  "responsible-parties": object[]; //TODO define this type
  parts: Part[];
}



export function getControlCatalogFromReviewedControls(reviewedControls: ReviewedControls): string {
  // find the prop with the name "Catalog Name" and return its value
  const catalogNameProp = reviewedControls.props.find((prop) => prop.name === "Catalog Name");
  if (catalogNameProp) {
    return catalogNameProp.value;
  }
  return "";
}*/
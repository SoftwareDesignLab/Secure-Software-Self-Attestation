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

@Injectable({
  providedIn: 'root'
})
export class ResultModelService {
  public assessmentResult: AssessmentResult | null = null;
}

export class AssessmentResult {
  uuid: string = "";
  metadata: Metadata = new Metadata();
  "import-ssp": object = {};
  "reviewed-controls": ReviewedControls[] = [];
  "assessment-subjects": Subject[] = [];

  constructor(json: JSON) {
    Object.assign(this, json);
    this.metadata = new Metadata(this.metadata);
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

export class ReviewedControls {
  "control-selections": ControlSelection[] = [];
}

export class ControlSelection {
  props: Prop[] = [];
  "include-controls": Control[] = [];
  "exclude-controls": Control[] = [];
}

export class Control {
  "control-id": string = "";
}

export class Subject {
  type: string = "";
  props: Prop[] = [];
  "include-all": Object = {};
}

function capitalize(str: String): string {
  return str.split(" ").map((word) => {return word.charAt(0).toUpperCase() + word.slice(1)}).join(" ");
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
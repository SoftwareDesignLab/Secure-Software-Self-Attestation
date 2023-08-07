import { v4 as uuid } from 'uuid';
import { Prop, Link } from './common';

export class Metadata {
  title: string = "Assessment Plan";
  "last-modified": string = new Date().toISOString();
  version: string = "1.0.0";
  "oscal-version": string = "1.0.4";
  published?: string;
  parties?: Party[];
  revisions?: Revision[];
  "document-ids"?: DocumentID[];
  props?: Prop[];
  links?: Link[];
  roles?: Role[];
  locations?: Location[];
  "responsible-parties"?: ResponsibleParty[];
  remarks?: string;
  
  addParty(party: Party) {
    if (this.parties === undefined) this.parties = [];
    this.parties.push(party);
    this.modify();
  }
  
  addBlankParty() {
    if (this.parties === undefined) this.parties = [];
    let newParty = new Party();
    this.parties.push(newParty);
  }
  
  modify() {
    this["last-modified"] = new Date().toISOString();
  }
  
  publish() {
    this.published = new Date().toISOString();
  }
  
  serialize(): object {
    let serialized = {
      "title": this.title,
      "last-modified": this["last-modified"],
      "version": this.version,
      "oscal-version": this["oscal-version"],
      "published": new Date().toISOString(),
      "parties": this.parties?.map(party => party.serialize()),
    };
    return serialized;
  }
}

//TODO other fields??
export class Party {
  uuid: string = uuid();
  type: string = "";
  name?: string;
  addresses?: Address[];
  props?: Prop[];
  links?: Link[];
  "email-addresses"?: string[];
  "telephone-numbers"?: TelephoneNumber[];
  remarks?: string;
  
  
  setName(name: string){
    this.name = name;
  }
  
  addAddress(addrlines: string[], city: string, state: string, postal: string, country: string) {
    let newAddress = new Address();
    newAddress["addr-lines"] = addrlines;
    newAddress.city = city;
    newAddress.state = state;
    newAddress["postal-code"] = postal;
    newAddress.country = country;
    this.addresses = [newAddress];
  }
  
  setPrimaryAddressLines(lines: string[]) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["addr-lines"] = lines;
  }
  setPrimaryAddressLine1(line: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["addr-lines"][0] = line;
  }
  setPrimaryAddressLine2(line: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["addr-lines"][1] = line;
  }
  setPrimaryCity(city: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].city = city;
  }
  setPrimaryState(state: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].state = state;
  }
  setPrimaryPostalCode(postal: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["postal-code"] = postal;
  }
  setPrimaryCountry(country: string) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].country = country;
  }
  
  addLink(href: string, rel?: string) {
    if (this.links === undefined) this.links = [];
    let newLink = new Link();
    newLink.href = href;
    newLink.rel = rel;
    this.links.push(newLink);
  }
  
  addEmailAddress(email: string) {
    if (this["email-addresses"] === undefined) this["email-addresses"] = [];
    this["email-addresses"].push(email);
  }
  
  addTelephoneNumber(number: string) {
    if (this["telephone-numbers"] === undefined) this["telephone-numbers"] = [];
    this["telephone-numbers"].push(new TelephoneNumber(number));
  }
  
  addProp(name: string, value: string, class_?: string, uuid?: string, ns?: string, remarks?: string) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }
  
  serialize(): object {
    let serialized = {
      "uuid": this.uuid,
      "type": this.type,
      "name": this.name,
      "addresses": this.addresses?.map((address) => address.serialize()),
      "props": this.props?.map((prop) => prop.serialize()),
      "remarks": this.remarks,
      "email-addresses": this["email-addresses"],
      "telephone-numbers": this["telephone-numbers"],
      "links": this.links?.map((link) => link.serialize()),
    };
    return serialized;
  }
}

//TODO convert to using constructor
export class Address {
  "addr-lines": string[] = [""];
  city: string = "";
  state: string = "";
  "postal-code": string = "";
  country: string = "";
  
  serialize(): object {
    let serialized = {
      "addr-lines": this["addr-lines"],
      "city": this.city,
      "state": this.state,
      "postal-code": this["postal-code"],
      "country": this.country,
    };
    return serialized;
  }
}

export class Revision {
  version: string;
  title?: string;
  published?: string;
  "last-modified"?: string;
  "oscal-version"?: string;
  props?: Prop[];
  links?: Link[];
  remarks?: string;
  
  constructor(version: string) {
    //version data type: ^\\S(.*\\S)?$
    if (version.match(/^\S(.*\S)?$/)) this.version = version;
    else throw new Error("Invalid version");
  }
}

export class Location {
  uuid: string = uuid();
  address: Address = new Address();
  title?: string;
  "email-addresses"?: string[];
  "telephone-numbers"?: string[];
  urls?: string[];
  props?: Prop[];
  links?: Link[];
  remarks?: string;
}

export class Role {
  id: string;
  title: string;
  "short-name"?: string;
  description?: string;
  props?: Prop[];
  links?: Link[];
  remarks?: string;
  
  constructor(id: string, title: string) {
    //TODO ID must match ^(\\p{L}|_)(\\p{L}|\\p{N}|[.\\-_])*$
    this.id = id;
    this.title = title;
  }
}

export class Citation {
  text: string;
  props?: Prop[];
  links?: Link[];
  
  constructor(text: string) {
    this.text = text;
  }
}

export class RLink {
  href: string;
  "media-type"?: string;
  hashes?: Hash[];
  
  constructor(href: string) {
    this.href = href;
  }
}

export class Base64 {
  value: string;
  filename?: string;
  "media-type"?: string;
  
  constructor(value: string, filename?: string, mediaType?: string) {
    this.value = value;
    this.filename = filename;
    this["media-type"] = mediaType;
  }
}

export class Resource {
  uuid: string = uuid();
  title?: string;
  description?: string;
  props?: Prop[];
  "document-ids"?: DocumentID[];
  "citation"?: Citation;
  "rlinks"?: RLink[];
  base64?: Base64;
  remarks?: string;
}

export class BackMatter {
  resources: Resource[] = [];
}

export class ResponsibleParty {
  "role-id": string;
  "party-uuids": string[];
  props?: Prop[];
  links?: Link[];
  remarks?: string;
  
  constructor(roleId: string, partyUuids: string[]) {
    this["role-id"] = roleId;
    this["party-uuids"] = partyUuids;
  }
}

export class ResponsibleRole {
  "role-id": string;
  "party-uuids"?: string[];
  props?: Prop[];
  links?: Link[];
  remarks?: string;
  
  constructor(roleId: string, partyUuids?: string[]) {
    this["role-id"] = roleId;
    this["party-uuids"] = partyUuids;
  }
}

export interface Hash {
  algorithm: string;
  value: string;
}

export class TelephoneNumber {
  number: string;
  type?: string;
  
  constructor(number: string, type?: string) {
    this.type = type;
    this.number = number;
  }
  
  serialize(): object {
    let serialized = {
      "number": this.number,
      "type": this.type,
    };
    return serialized;
  }
}

export class DocumentID {
  identifier: string;
  scheme?: string; //TODO must match ^[a-zA-Z][a-zA-Z0-9+\\-.]+:.+$

  constructor(identifier: string, scheme?: string) {
    this.identifier = identifier;
    this.scheme = scheme;
  }
}
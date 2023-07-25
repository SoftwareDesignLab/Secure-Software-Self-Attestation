import { v4 as uuid } from 'uuid';

enum AssessmentSubjectType {
  Component = "component", 
  InventoryItem = "inventory-item", 
  Location = "location",
  Party = "party",
  User = "user",
}

enum SubjectIDType {
  Component = "component", 
  InventoryItem = "inventory-item", 
  Location = "location", 
  Party = "party", 
  User = "user", 
  Resource = "resource",
}

class AssessmentPart {
  name: String = "";
  title?: String;
  uuid?: String;
  ns?: String;
  class?: String;
  props?: Prop[];
  prose?: String;
  parts?: AssessmentPart[];
  links?: Link[];

  generateUUID() {
    this.uuid = uuid();
  }

  serialize(): object {
    let serialized = {
      "name": this.name,
      "title": this.title,
      "uuid": this.uuid,
      "ns": this.ns,
      "class": this.class,
      "props": this.props?.map(prop => prop.serialize()),
      "prose": this.prose,
      "parts": this.parts?.map(part => part.serialize()),
      "links": this.links?.map(link => link.serialize()),
    };
    return serialized;
  }
}

class TermsAndConditions {
  parts: AssessmentPart[] = [];

  addPart(name: String, title?: String, uuid?: String, ns?: String, class_?: String, props?: Prop[], prose?: String, parts?: AssessmentPart[], links?: Link[]) {
    let newPart = new AssessmentPart();
    newPart.name = name;
    if (title !== undefined ) newPart.title = title;
    if (uuid !== undefined ) newPart.uuid = uuid;
    if (ns !== undefined ) newPart.ns = ns;
    if (class_ !== undefined ) newPart.class = class_;
    if (props !== undefined ) newPart.props = props;
    if (prose !== undefined ) newPart.prose = prose;
    if (parts !== undefined ) newPart.parts = parts;
    if (links !== undefined ) newPart.links = links;
    this.parts.push(newPart);
  }

  serialize(): object {
    let serialized = [];
    for (let part of this.parts) {
      serialized.push(part.serialize());
    }
    return serialized;
  }
}

class ImportSSP {
  href: String = "";
  remarks?: String;

  serialize(): object {
    let serialized = {
      "href": this.href,
      "remarks": this.remarks,
    };
    return serialized;
  }
}

class ControlID {
  "control-id": String = "";
  "statement-ids"?: String[];

  serialize(): object {
    let serialized = {
      "control-id": this["control-id"],
      "statement-ids": this["statement-ids"],
    };
    return serialized;
  }
}

export class ControlSelection {
  description?: String;
  props?: Prop[];
  links?: Link[];
  "include-all"?: Boolean | object;
  "include-controls"?: ControlID[];
  "exclude-controls"?: ControlID[];
  remarks?: String;

  constructor(description?: String, props?: Prop[], links?: Link[], includeAll?: Boolean, includeControls?: ControlID[], excludeControls?: ControlID[], remarks?: String) {
    this.description = description;
    this.props = props;
    this.links = links;
    this["include-all"] = includeAll;
    this["include-controls"] = includeControls;
    this["exclude-controls"] = excludeControls;
    this.remarks = remarks;
  }

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    if (class_ !== undefined) newProp.class = class_;
    if (uuid !== undefined) newProp.uuid = uuid;
    if (ns !== undefined) newProp.ns = ns;
    if (remarks !== undefined) newProp.remarks = remarks;
    this.props.push(newProp);
  }

  addLink(href: String, rel?: String) {
    let link = new Link();
    link.href = href;
    if (rel !== undefined) link.rel = rel;
    if (this.links === undefined) this.links = [];
    this.links.push(link);
  }

  addIncludeControl(controlID: String, statementIDs?: String[]) {
    let newControlID = new ControlID();
    newControlID["control-id"] = controlID;
    if (statementIDs !== undefined) newControlID["statement-ids"] = statementIDs;
    if (this["include-controls"] === undefined) this["include-controls"] = [];
    this["include-controls"].push(newControlID);
  }

  removeIncludeControl(controlID: String) {
    if (this["include-controls"] === undefined) return;
    let index = this["include-controls"].findIndex(control => control["control-id"] === controlID);
    if (index > -1) this["include-controls"].splice(index, 1);
  }

  addExcludeControl(controlID: String, statementIDs?: String[]) {
    let newControlID = new ControlID();
    newControlID["control-id"] = controlID;
    if (statementIDs !== undefined) newControlID["statement-ids"] = statementIDs;
    if (this["exclude-controls"] === undefined) this["exclude-controls"] = [];
    this["exclude-controls"].push(newControlID);
  }

  removeExcludeControl(controlID: String) {
    if (this["exclude-controls"] === undefined) return;
    let index = this["exclude-controls"].findIndex(control => control["control-id"] === controlID);
    if (index > -1) this["exclude-controls"].splice(index, 1);
  }

  setIncludeAll(includeAll: Boolean) {
    this["include-all"] = includeAll;
    this['include-controls'] = undefined;
    this['exclude-controls'] = undefined;
  }

  removeProp(name: String, class_: string) {
    if (this.props === undefined) return;
    let index = this.props.findIndex(prop => prop.name === name && prop.class === class_);
    if (index > -1) this.props.splice(index, 1);
  }

  serialize(): object {
    let serialized = {
      "description": this.description,
      "props": this.props?.map(prop => prop.serialize()),
      "links": this.links?.map(link => link.serialize()),
      "include-all": this["include-all"],
      "include-controls": this["include-controls"]?.map(control => control.serialize()),
      "exclude-controls": this["exclude-controls"]?.map(control => control.serialize()),
      "remarks": this.remarks,
    };
    if (serialized['include-all']) {
      delete serialized['include-controls'];
      delete serialized['exclude-controls'];
      serialized['include-all'] = {};
    }
    return serialized;
  }
}

class Link {
  href: String = "";
  rel?: String;

  serialize(): object {
    let serialized = {
      "href": this.href,
      "rel": this.rel,
    };
    return serialized;
  }
}

class ReviewedControls {
  "control-selections": ControlSelection[] = [];
  props?: Prop[];
  links?: Link[];
  description?: String;
  remarks?: String;

  constructor() {
  }

  addControlSelection(description: String = "", props: Prop[] = [], links: Link[] = [], includeAll: Boolean = false, includeControls: ControlID[] = [], excludeControls: ControlID[] = [], remarks: String = "") {
    let newControlSelection = new ControlSelection(description, props, links, includeAll, includeControls, excludeControls, remarks);
    this["control-selections"].push(newControlSelection);
  }

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }

  //For serialization, if controlSelection is empty, add a blank controlSelection
  serialize(): object {
    let serialized = {
      "control-selections": this["control-selections"].map(controlSelection => controlSelection.serialize()),
      "props": this.props?.map(prop => prop.serialize()),
      "links": this.links?.map(link => link.serialize()),
      "description": this.description,
      "remarks": this.remarks,
    };
    if (serialized['control-selections'].length === 0) {
      let newControlSelection = new ControlSelection();
      serialized['control-selections'].push(newControlSelection.serialize());
    }
    return serialized;
  }
} 

export class Prop {
  name: String;
  value: String;
  class?: String;
  uuid?: String;
  ns?: String;
  remarks?: String;

  constructor(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    this.name = name;
    this.value = value;
    this.class = class_;
    this.uuid = uuid;
    this.ns = ns;
    this.remarks = remarks;
  }

  serialize(): object {
    let serialized = {
      "name": this.name,
      "value": this.value,
      "class": this.class,
      "uuid": this.uuid,
      "ns": this.ns,
      "remarks": this.remarks,
    };
    return serialized;
  }
}

class Address {
  "addr-lines": String[] = [""];
  city: String = "";
  state: String = "";
  "postal-code": String = "";
  country: String = "";

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

class Party {
  uuid: String = uuid();
  type: String = "";
  name?: String;
  addresses?: Address[];
  props?: Prop[];
  remarks?: String;
  "email-addresses"?: String[];
  "telephone-numbers"?: String[];
  links?: Link[];

  addAddress(addrlines: String[], city: String, state: String, postal: String, country: String) {
    let newAddress = new Address();
    newAddress["addr-lines"] = addrlines;
    newAddress.city = city;
    newAddress.state = state;
    newAddress["postal-code"] = postal;
    newAddress.country = country;
    this.addresses = [newAddress];
  }

  setPrimaryAddressLines(lines: String[]) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["addr-lines"] = lines;
  }
  setPrimaryCity(city: String) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].city = city;
  }
  setPrimaryState(state: String) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].state = state;
  }
  setPrimaryPostalCode(postal: String) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0]["postal-code"] = postal;
  }
  setPrimaryCountry(country: String) {
    if (this.addresses === undefined) {
      this.addresses = [new Address()];
    }
    this.addresses[0].country = country;
  }

  addLink(href: String, rel?: String) {
    if (this.links === undefined) this.links = [];
    let newLink = new Link();
    newLink.href = href;
    newLink.rel = rel;
    this.links.push(newLink);
  }

  addEmailAddress(email: String) {
    if (this["email-addresses"] === undefined) this["email-addresses"] = [];
    this["email-addresses"].push(email);
  }

  addTelephoneNumber(number: String) {
    if (this["telephone-numbers"] === undefined) this["telephone-numbers"] = [];
    this["telephone-numbers"].push(number);
  }

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
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

export class SubjectID {
  type: SubjectIDType = SubjectIDType.Component; //can be component, inventory-item, location, party, user or resource
  "subject-uuid": String = uuid();
  props?: Prop[];
  links?: Link[];
  remarks?: String;

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }

  addLink(href: String, rel?: String) {
    if (this.links === undefined) this.links = [];
    let newLink = new Link();
    newLink.href = href;
    newLink.rel = rel;
    this.links.push(newLink);
  }

  setType(type: SubjectIDType) {
    this.type = type;
  }

  serialize(): object {
    let serialized = {
      "type": this.type,
      "subject-uuid": this["subject-uuid"],
      "props": this.props?.map((prop) => prop.serialize()),
      "remarks": this.remarks,
      "links": this.links?.map((link) => link.serialize()),
    };
    return serialized;
  }
}

export class AssessmentSubject {
  type: AssessmentSubjectType = AssessmentSubjectType.Party;
  description?: String;
  props?: Prop[];
  links?: Link[];
  remarks?: String;
  "include-all"?: Boolean | object;
  "include-subjects"?: SubjectID[];
  "exclude-subjects"?: SubjectID[];
  private subjectMemory: Array<Array<SubjectID> | undefined> = [[], []];

  includeAll(bool: Boolean) {
    this["include-all"] = bool;
    if (bool) {
      this.subjectMemory[0] = this["include-subjects"];
      this.subjectMemory[1] = this["exclude-subjects"];
      this["include-subjects"] = undefined;
      this["exclude-subjects"] = undefined;
    } else {
      this["include-subjects"] = this.subjectMemory[0];
      this["exclude-subjects"] = this.subjectMemory[1];
    }
  }

  includeNewSubject(type: SubjectIDType) {
    if (this["include-subjects"] === undefined) this["include-subjects"] = [];
    let newSubjectID = new SubjectID();
    newSubjectID.type = type;
    newSubjectID["subject-uuid"] = uuid();
    this["include-subjects"].push(newSubjectID);
    this.subjectMemory[0] = this["include-subjects"];
  }

  excludeNewSubject(type: SubjectIDType) {
    if (this["exclude-subjects"] === undefined) this["exclude-subjects"] = [];
    let newSubjectID = new SubjectID();
    newSubjectID.type = type;
    newSubjectID["subject-uuid"] = uuid();
    this["exclude-subjects"].push(newSubjectID);
    this.subjectMemory[1] = this["exclude-subjects"];
  }

  //TODO move subject from exclude -> include or back

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }

  //TODO during serialization, if include-all is true, convert include-all to an empty object or undefined if it is false
  serialize(): object {
    let serialized = {
      "type": this.type,
      "description": this.description,
      "props": this.props?.map(prop => prop.serialize()),
      "remarks": this.remarks,
      "include-all": this["include-all"],
      "include-subjects": this["include-subjects"]?.map(subject => subject.serialize()),
      "exclude-subjects": this["exclude-subjects"]?.map(subject => subject.serialize()),
      "links": this.links?.map(link => link.serialize()),
    };
    if (this["include-all"] === true){
      delete serialized["include-subjects"];
      delete serialized["exclude-subjects"];
      serialized["include-all"] = {};
    };
    return serialized;
  }
}

export class APMetadata {
  title: String = "Assessment Plan";
  "last-modified": String = new Date().toISOString();
  version: String = "1.0.0";
  "oscal-version": String = "1.0.4";
  published: String = new Date().toISOString();
  parties: Party[] = [];

  addParty(party: Party) {
    this.parties.push(party);
    this.modify();
  }

  addBlankParty() {
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
      "parties": this.parties.map(party => party.serialize()),
    };
    return serialized;
  }
}

//TODO local definitions
// class LocalDefinitions {

// }

//TODO assessment assets - will be important for 3rd party tests
// class AssessmentAssets {

// }

export class AssessmentPlan {
  uuid: String = uuid();
  metadata: APMetadata = new APMetadata();
  "import-ssp": ImportSSP = new ImportSSP();
  "reviewed-controls": ReviewedControls = new ReviewedControls();
  "assessment-subjects"?: AssessmentSubject[];
  "terms-and-conditions"?: TermsAndConditions;

  addAssessmentSubject(type: AssessmentSubjectType = AssessmentSubjectType.Party, description?: String) {
    if (this["assessment-subjects"] === undefined) this["assessment-subjects"] = [];
    let newAssessmentSubject = new AssessmentSubject();
    newAssessmentSubject.type = type;
    newAssessmentSubject.description = description;
    this["assessment-subjects"].push(newAssessmentSubject);
  }


  serialize(): object {
    let serialized = {
      "uuid": this.uuid,
      "metadata": this.metadata.serialize(),
      "import-ssp": this["import-ssp"].serialize(),
      "reviewed-controls": this["reviewed-controls"].serialize(),
      "assessment-subjects": this["assessment-subjects"]?.map((subject) => subject.serialize()),
      "terms-and-conditions": this["terms-and-conditions"]?.serialize(),
    };
    return serialized;
  }
}
  
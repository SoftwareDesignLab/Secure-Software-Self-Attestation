import { uuid } from 'uuidv4';

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
}

class ImportSSP {
  href: String = "";
  remarks?: String;
}

class ControlID {
  "control-id": String = "";
  "statement-ids"?: String[];
}

export class ControlSelection {
  description?: String;
  props?: Prop[];
  links?: Link[];
  "include-all"?: Boolean;
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
    let newProp = new Prop();
    newProp.name = name;
    newProp.value = value;
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
}

class Link {
  href: String = "";
  rel?: String;
}

class ReviewedControls {
  "control-selections": ControlSelection[] = [];
  props?: Prop[];
  links?: Link[];
  description?: String;
  remarks?: String;

  constructor() {
    this.addControlSelection();
  }

  addControlSelection(description: String = "", props: Prop[] = [], links: Link[] = [], includeAll: Boolean = false, includeControls: ControlID[] = [], excludeControls: ControlID[] = [], remarks: String = "") {
    let newControlSelection = new ControlSelection(description, props, links, includeAll, includeControls, excludeControls, remarks);
    this["control-selections"].push(newControlSelection);
  }

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop();
    newProp.name = name;
    newProp.value = value;
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }
} 

class Prop {
  name: String = "";
  value: String = "";
  class?: String;
  uuid?: String;
  ns?: String;
  remarks?: String;
}

class Address {
  "addr-lines": String[] = [""];
  city: String = "";
  state: String = "";
  "postal-code": String = "";
  country: String = "";
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
    let newProp = new Prop();
    newProp.name = name;
    newProp.value = value;
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
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
    let newProp = new Prop();
    newProp.name = name;
    newProp.value = value;
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
}

export class AssessmentSubject {
  type: AssessmentSubjectType = AssessmentSubjectType.Party;
  description?: String;
  props?: Prop[];
  links?: Link[];
  remarks?: String;
  "include-all"?: Boolean;
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

  addSubjectID(type: SubjectIDType) {
    if (this["include-subjects"] === undefined) this["include-subjects"] = [];
    let newSubjectID = new SubjectID();
    newSubjectID.type = type;
    newSubjectID["subject-uuid"] = uuid();

  }

  addProp(name: String, value: String, class_?: String, uuid?: String, ns?: String, remarks?: String) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop();
    newProp.name = name;
    newProp.value = value;
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }

  //TODO during serialization, if include-all is true, convert include-all to an empty object or undefined if it is false

}

class APMetadata {
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

}
  
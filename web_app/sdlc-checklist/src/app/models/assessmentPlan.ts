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
  name: string = "";
  title?: string;
  uuid?: string;
  ns?: string;
  class?: string;
  props?: Prop[];
  prose?: string;
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

  addPart(name: string, title?: string, uuid?: string, ns?: string, class_?: string, props?: Prop[], prose?: string, parts?: AssessmentPart[], links?: Link[]) {
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
  href: string = "";
  remarks?: string;

  serialize(): object {
    let serialized = {
      "href": this.href,
      "remarks": this.remarks,
    };
    return serialized;
  }
}

class ControlID {
  "control-id": string = "";
  "statement-ids"?: string[];

  serialize(): object {
    let serialized = {
      "control-id": this["control-id"],
      "statement-ids": this["statement-ids"],
    };
    return serialized;
  }
}

export class ControlSelection {
  description?: string;
  props?: Prop[];
  links?: Link[];
  "include-all"?: Boolean | object = false;
  "include-controls"?: ControlID[];
  "exclude-controls"?: ControlID[];
  private "include-controls-memory"?: ControlID[];
  private "exclude-controls-memory"?: ControlID[];
  remarks?: string;



  constructor(description?: string, props?: Prop[], links?: Link[], includeAll?: Boolean, includeControls?: ControlID[], excludeControls?: ControlID[], remarks?: string) {
    this.description = description;
    this.props = props;
    this.links = links;
    this["include-all"] = includeAll;
    this["include-controls-memory"] = includeControls;
    this["exclude-controls-memory"] = excludeControls;
    this.remarks = remarks;
  }

  addProp(name: string, value: string, class_?: string, uuid?: string, ns?: string, remarks?: string) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    if (class_ !== undefined) newProp.class = class_;
    if (uuid !== undefined) newProp.uuid = uuid;
    if (ns !== undefined) newProp.ns = ns;
    if (remarks !== undefined) newProp.remarks = remarks;
    this.props.push(newProp);
  }

  addLink(href: string, rel?: string) {
    let link = new Link();
    link.href = href;
    if (rel !== undefined) link.rel = rel;
    if (this.links === undefined) this.links = [];
    this.links.push(link);
  }

  addIncludeControl(controlID: string, statementIDs?: string[]) {
    let newControlID = new ControlID();
    newControlID["control-id"] = controlID;
    if (statementIDs !== undefined) newControlID["statement-ids"] = statementIDs;
    if (this["include-controls"] === undefined) this["include-controls"] = [];
    this["include-controls"].push(newControlID);

    if (this["include-controls-memory"] === undefined) this["include-controls-memory"] = [];
    this["include-controls-memory"].push(newControlID);
  }

  removeIncludeControl(controlID: string) {
    if (this["include-controls"]===undefined||this['include-controls-memory'] === undefined) return;
    let index = this["include-controls"].findIndex(control => control["control-id"] === controlID);
    if (index > -1){
      this["include-controls"].splice(index, 1);
      this["include-controls-memory"].splice(index,1);
    }
    if (this["include-controls"].length === 0){
      delete this["include-controls"];
      }
  }

  addExcludeControl(controlID: string, statementIDs?: string[]) {
    let newControlID = new ControlID();
    newControlID["control-id"] = controlID;
    if (statementIDs !== undefined) newControlID["statement-ids"] = statementIDs;
    if (this["exclude-controls"] === undefined) this["exclude-controls"] = [];
    this["exclude-controls"].push(newControlID);

    if (this["exclude-controls-memory"] === undefined) this["exclude-controls-memory"] = [];
    this["exclude-controls-memory"].push(newControlID);
    
    if(this['include-all']=true){
      this.setIncludeAll(false);
    }
  }

  removeExcludeControl(controlID: string) {
    if (this["exclude-controls"] === undefined||this['exclude-controls-memory'] === undefined) return;
    let index = this["exclude-controls"].findIndex(control => control["control-id"] === controlID);
    if (index > -1){
      this["exclude-controls"].splice(index, 1);
      this["exclude-controls-memory"].splice(index,1);
    }
    if (this["exclude-controls"].length === 0){
      //delete this["exclude-controls"];
      this.setIncludeAll(true);
    }
  }

  setIncludeAll(includeAll: Boolean) {
    
    if(includeAll){
      this["include-all"] = includeAll;
      this['include-controls'] = undefined;
      this['exclude-controls'] = undefined;
    }
    else{
      this["include-all"] = undefined;
      if(this['include-controls-memory'] !== undefined){
      this["include-controls"] = JSON.parse(JSON.stringify(this['include-controls-memory']));
      }
      if(this['exclude-controls-memory']){      
        this['exclude-controls'] = JSON.parse(JSON.stringify(this['exclude-controls-memory']));
      }
    }
  }

  propExists(name: string, value: string) {
    if (this.props === undefined) return false;
    return this.props.some(prop => prop.name === name && prop.value === value);
  }

  removeProp(name: string, class_: string) {
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
      "include-controls": this["include-controls-memory"]?.map(control => control.serialize()),
      "exclude-controls": this["exclude-controls-memory"]?.map(control => control.serialize()),
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
  href: string = "";
  rel?: string;

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
  description?: string;
  remarks?: string;

  constructor() {
  }

  addControlSelection(description: string = "", props: Prop[] = [], links: Link[] = [], includeAll: Boolean = false, includeControls: ControlID[] = [], excludeControls: ControlID[] = [], remarks: string = "") {
    let newControlSelection = new ControlSelection(description, props, links, includeAll, includeControls, excludeControls, remarks);
    this["control-selections"].push(newControlSelection);
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
  name: string;
  value: string;
  class?: string;
  uuid?: string;
  ns?: string;
  remarks?: string;

  constructor(name: string, value: string, class_?: string, uuid?: string, ns?: string, remarks?: string) {
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

class Party {
  uuid: string = uuid();
  type: string = "";
  name?: string;
  addresses?: Address[];
  props?: Prop[];
  remarks?: string;
  "email-addresses"?: string[];
  "telephone-numbers"?: string[];
  links?: Link[];

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
    this["telephone-numbers"].push(number);
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

export class SubjectID {
  type: SubjectIDType = SubjectIDType.Component; //can be component, inventory-item, location, party, user or resource
  "subject-uuid": string = uuid();
  props?: Prop[];
  links?: Link[];
  remarks?: string;

  addProp(name: string, value: string, class_?: string, uuid?: string, ns?: string, remarks?: string) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value);
    newProp.class = class_;
    newProp.uuid = uuid;
    newProp.ns = ns;
    newProp.remarks = remarks;
    this.props.push(newProp);
  }

  removeProp(name: string, class_?: string) {
    if (this.props === undefined) return;
    this.props = this.props.filter((prop) => prop.name !== name && ( class_ !== undefined ? prop.class !== class_ : true));
  }

  addLink(href: string, rel?: string) {
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
  description?: string;
  props?: Prop[];
  links?: Link[];
  remarks?: string;
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
      "type": this.type,
      "description": this.description,
      "props": this.props?.map(prop => prop.serialize()),
      "remarks": this.remarks,
      "include-all": this["include-all"] ? {} : undefined,
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
  title: string = "Assessment Plan";
  "last-modified": string = new Date().toISOString();
  version: string = "1.0.0";
  "oscal-version": string = "1.0.4";
  published: string = new Date().toISOString();
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
  uuid: string = uuid();
  metadata: APMetadata = new APMetadata();
  "import-ssp": ImportSSP = new ImportSSP();
  "reviewed-controls": ReviewedControls = new ReviewedControls();
  "assessment-subjects"?: AssessmentSubject[];
  "terms-and-conditions"?: TermsAndConditions;

  addAssessmentSubject(type: AssessmentSubjectType = AssessmentSubjectType.Party, description?: string) {
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
  
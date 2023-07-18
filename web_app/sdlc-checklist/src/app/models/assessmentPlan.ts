import { uuid } from 'uuidv4';

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

  addPart(name: String, title: String, uuid: String, ns: String, class_: String, props: Prop[], prose: String, parts: AssessmentPart[], links: Link[]) {
    let newPart = new AssessmentPart();
    newPart.name = name;
    newPart.title = title;
    newPart.uuid = uuid;
    newPart.ns = ns;
    newPart.class = class_;
    newPart.props = props;
    newPart.prose = prose;
    newPart.parts = parts;
    newPart.links = links;
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

class ControlSelection {
  description?: String;
  props?: Prop[];
  links?: Link[];
  "include-all"?: Boolean;
  "include-controls"?: ControlID[];
  "exclude-controls"?: ControlID[];
  remarks?: String;
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
  private _first_name?: String;
  private _last_name?: String;

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
}

class SubjectID {
  type: String = "component"; //can be component, inventory-item, location, party, user or resource
  "subject-uuid": String = "";
  props?: Prop[];
  links?: Link[];
  remarks?: String;
}

class AssessmentSubject {
  type: String = "party"; //can be component, inventory-item, location, party or user
  description?: String;
  props?: Prop[];
  links?: Link[];
  remarks?: String;
  "include-all"?: Boolean;
  "include-subjects"?: SubjectID[];
  "exclude-subjects"?: SubjectID[];
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

//TODO assessment assets
// class AssessmentAssets {

// }

export class AssessmentPlan {
  uuid: String = uuid();
  metadata: APMetadata = new APMetadata();
  "import-ssp": ImportSSP = new ImportSSP();
  "reviewed-controls": ReviewedControls = new ReviewedControls();
  "assessment-subjects": AssessmentSubject[] = [];
  "terms-and-conditions": TermsAndConditions = new TermsAndConditions();
}
  
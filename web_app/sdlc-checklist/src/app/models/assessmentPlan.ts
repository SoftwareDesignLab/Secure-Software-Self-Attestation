import { uuid } from 'uuidv4';

class ImportSSP {
  href: String = "";
  remarks?: String;
}

class ControlSelection {

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

export class AssessmentPlan {
  uuid: String = uuid();
  metadata: APMetadata = new APMetadata();

}
  
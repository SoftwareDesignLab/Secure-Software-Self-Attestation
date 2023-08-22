//TODO add all OSCAL common classes here: Metadata, Part, Parameter 
import { v4 as uuid } from 'uuid';
import { ResponsibleRole, ResponsibleParty } from './metadata';

/*
  Control Common Classes
*/
export enum HowMany {
  "one",
  "one-or-more"
}

export class Link {
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

export class Part {
  name: string;
  id?: string;
  ns?: string;
  class?: string;
  title?: string;
  props?: Prop[];
  prose?: string;
  parts?: Part[];
  links?: Link[];

  constructor (name: string) {
    this.name = name
  }
}

export class Parameter {
  id: string = uuid();
  class?: string;
  "depends-on"?: string;
  props?: Prop[];
  links?: Link[];
  label?: string;
  usage?: string;
  constrints?: ParameterConstraint[];
  guidelines?: ParameterGuideline[];
  values?: string[];
  select?: ParameterSelection;
  remarks?: string;

  serialize() {
    //TODO 
  }
}

export class ConstraintTest {
  expression: string = ".*";
  remarks?: string;
}

export class ParameterConstraint {
  description: string = "";
  tests?: ConstraintTest[];
}

export interface ParameterGuideline {
  prose: string;
}

export class ParameterSelection {
  choice: string[];
  "how-many": HowMany;

  constructor (choice: string[]) {
    switch (choice.length) {
      case 0:
        throw new Error("ParameterSelection must have at least one choice");
      case 1:
        this["how-many"] = HowMany.one;
        break;
      default:
        this["how-many"] = HowMany["one-or-more"];
        break;
    }
    this.choice = choice;
  }
  //TODO do not serialize choice field if list is empty
}


/*
  Implementation Common Classes
*/

export enum SystemComponentType {
  "this-system",
  "system",
  "interconnection",
  "software",
  "hardware",
  "service",
  "policy", 
  "physical",
  "process-procedure",
  "plan",
  "guidance",
  "standard",
  "validation",
  "network"
}

export enum SystemComponentState {
  "underdevelopment",
  "operational",
  "disposition",
  "other"
}

export enum TransportType {
  "TCP",
  "UDP"
}

export enum ImplementationState {
  "implemented",
  "partial",
  "planned",
  "alternative",
  "not-applicable"
}

export enum SystemIDType {
  "https://fedramp.gov",
  "https://fedramp.gov/ns/oscal",
  "https://ietf.org/rfc/rfc4122",
  "http://ietf.org/rfc/rfc4122",
}

export class SystemComponent {
  uuid: string = uuid();
  type: SystemComponentType;
  title: string = "";
  description: string = "";
  status: SystemComponentStatus;
  purpose: string = "";
  props?: Prop[];
  links?: Link[];
  "responsible-roles": ResponsibleRole[] = [];
  protocols?: Protocol[];
  remarks?: string;

  constructor (type: SystemComponentType, title: string, description: string, status: SystemComponentStatus) {
    this.type = type;
    this.title = title;
    this.description = description;
    this.status = status;
  }

  addProp(name: string, value: string, class_?: string, uuid?: string, ns?: string, remarks?: string) {
    if (this.props === undefined) this.props = [];
    let newProp = new Prop(name, value, class_, uuid, ns, remarks);
    this.props.push(newProp);
  }

  newProp(prop: Prop) {
    if (this.props === undefined) this.props = [];
    this.props.push(prop);
  }
}

export class SystemComponentStatus {
  state: SystemComponentState
  remarks?: string;

  constructor (state: SystemComponentState) {
    this.state = state;
  }
}

export class Protocol {
  name: string = "";
  uuid?: string;
  title?: string;
  "port-ranges"?: PortRange[];

  constructor (name: string) {
    this.name = name;
  }
}

export class PortRange {
  start: number;
  end: number;
  transport: TransportType;

  constructor (start: number, end: number, transport: TransportType) {
    this.start = start;
    this.end = end;
    this.transport = transport;
  }
}

export class ImplementationStatus {
  state: ImplementationState;
  remarks?: string;

  constructor (state: ImplementationState) {
    this.state = state;
  }
}

export class SystemUser {
  uuid: string = uuid();
  title?: string;
  "short-name"?: string;
  description?: string;
  props?: Prop[];
  links?: Link[];
  "role-ids"?: string[];
  "authorized-privileges"?: AuthorizedPrivilege[];
  remarks?: string;

  constructor (title?: string, shortName?: string, description?: string) {
    this.title = title;
    this.description = description;
    this["short-name"] = shortName;
  }
}

export class AuthorizedPrivilege {
  title: string;
  "functions-performed": string[];
  description?: string;

  constructor (title: string, functionsPerformed: string[]) {
    this.title = title;
    this["functions-performed"] = functionsPerformed;
  }
}

export class ImplementedComponent {
  "component-uuid": string;
  props?: Prop[];
  links?: Link[];
  "responsible-parties"?: ResponsibleParty[];
  remarks?: string;

  constructor (componentUUID: string) {
    this["component-uuid"] = componentUUID;
  }
}

export class InventoryItem {
  uuid: string = uuid();
  description: string = "";
  props?: Prop[];
  links?: Link[];
  "responsible-parties"?: ResponsibleParty[];
  "implemented-components"?: ImplementedComponent[];
  remarks?: string;

  constructor (description: string) {
    this.description = description;
  }
}

export class SetParameterValue {
  "param-id": string;
  values: string[];
  remarks?: string;

  constructor (paramID: string, values: string[]) {
    this["param-id"] = paramID;
    this.values = values;
  }
}

export class SystemID {
  id: string;
  "identifier-type"?: string | SystemIDType;

  constructor (id: string, identifierType?: string | SystemIDType) {
    this.id = id;
    this["identifier-type"] = identifierType;
  }
}
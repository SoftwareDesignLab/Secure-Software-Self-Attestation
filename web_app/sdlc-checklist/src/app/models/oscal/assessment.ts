import { v4 as uuid } from 'uuid';
import { Prop, Link, Part, SystemComponent, ImplementationStatus } from './common'
import { ResponsibleParty, ResponsibleRole } from './metadata';

export enum AssessmentSubjectType {
  Component = "component", 
  InventoryItem = "inventory-item", 
  Location = "location",
  Party = "party",
  User = "user",
}

export enum SubjectIDType {
  Component = "component", 
  InventoryItem = "inventory-item", 
  Location = "location", 
  Party = "party", 
  User = "user", 
  Resource = "resource",
}

export enum TaskType {
  "milestone",
  "action"
}

export enum OriginActorType {
  "tool",
  "assessment-platform",
  "party"
}

export enum FindingTargetType {
  "statement-id",
  "objective-id"
}

export enum ObjectiveStatusState {
  "satisfied",
  "not-satisfied"
}

export enum ObjectiveStatusReason {
  "pass",
  "fail",
  "other"
}

export enum TimeUnit {
  "seconds",
  "minutes",
  "hours",
  "days",
  "months",
  "years"
}

export enum RiskStatus {
  "open",
  "investigating",
  "remediating",
  "deviation-requested",
  "deviation-approved",
  "closed"
}

export enum RemediationIntent {
  "recommendation",
  "planned",
  "completed"
}

export enum ThreatTypeIDSystem {
  "http://fedramp.gov",
  "http://fedramp.gov/ns/oscal"
}

export enum FacetNamingSystem {
  "http://fedramp.gov",
  "http://fedramp.gov/ns/oscal",
  "http://csrc.nist.gov/ns/oscal",
  "http://csrc.nist.gov/ns/oscal/unknown",
  "http://cve.mitre.org",
  "http://www.first.org/cvss/v2.0",
  "http://www.first.org/cvss/v3.0",
  "http://www.first.org/cvss/v3.1"
}

export class ControlSelection {
    description?: string;
    props?: Prop[];
    links?: Link[];
    remarks?: string;
    "include-all"?: Boolean | object = false;
  
    //Controls used for serialization
    "include-controls"?: ControlID[];
    "exclude-controls"?: ControlID[];
  
    //Controls used for remembering
    private "include-controls-memory"?: ControlID[];
    private "exclude-controls-memory"?: ControlID[];
  
  
  
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
        this.setIncludeAll(true);
      }
    }
  
    //If include-all is true, then hides all exclude controls/include controls
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
  
  
  export class ControlID {
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
  
  export class ReviewedControls {
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
  
  export class SubjectID {
    "subject-uuid": string = uuid();
    type: SubjectIDType; //can be component, inventory-item, location, party, user or resource
    props?: Prop[];
    links?: Link[];
    remarks?: string;

    constructor(type: SubjectIDType) {
      this.type = type;
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

  export class SubjectReference {
    "subject-uuid": string = uuid();
    type: SubjectIDType; //can be component, inventory-item, location, party, user or resource
    title?: string;
    props?: Prop[];
    links?: Link[];
    remarks?: string;

    constructor(type: SubjectIDType, title?: string) {
      this.type = type;
      this.title = title;
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
  
    //TODO ask for uuid
    includeNewSubject(type: SubjectIDType) {
      if (this["include-subjects"] === undefined) this["include-subjects"] = [];
      let newSubjectID = new SubjectID(type);
      newSubjectID["subject-uuid"] = uuid();
      this["include-subjects"].push(newSubjectID);
      this.subjectMemory[0] = this["include-subjects"];
    }
    
    //TODO ask for uuid
    excludeNewSubject(type: SubjectIDType) {
      if (this["exclude-subjects"] === undefined) this["exclude-subjects"] = [];
      let newSubjectID = new SubjectID(type);
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

  export class AssessmentPart {
    name: string;
    uuid?: string;
    ns?: string;
    class?: string;
    title?: string;
    props?: Prop[];
    prose?: string;
    parts?: AssessmentPart[];
    links?: Link[];
  
    constructor (name: string) {
      this.name = name
    }
  }

  export class UsesComponent {
    "component-uuid": string = uuid();
    props?: Prop[];
    links?: Link[];
    "responsible-parties"?: ResponsibleParty[];
    remarks?: string;
  }

  export class AssessmentPlatform {
    uuid: string = uuid();
    title?: string;
    props?: Prop[];
    links?: Link[];
    "uses-components"?: UsesComponent[];
  }

  export class AssessmentAsset {
    "assessment-platforms": AssessmentPlatform[] = [];
    components?: SystemComponent[];
  }

  export class Task {
    uuid: string = uuid();
    type: TaskType | string;
    title: string;
    description?: string;
    props?: Prop[];
    links?: Link[];
    timing?: EventTiming;
    dependencies?: TaskDependency[];
    tasks?: Task[];
    "associated-activities"?: AssociatedActivity[];
    subjects?: AssessmentSubject[];
    "responsible-roles": ResponsibleRole[];
    remarks?: string;

    constructor(type: TaskType | string, title: string, description?: string, remarks?: string) {
      this.type = type;
      this.title = title;
      this.description = description;
      this.remarks = remarks;
    }
  }

  export class AssociatedActivity {
    "activity-uuid": string;
    subjects: AssessmentSubject[];
    props?: Prop[];
    links?: Link[];
    "responsible-roles"?: ResponsibleRole[];
    remarks?: string;

    constructor(activityUUID: string, subjects: AssessmentSubject[], remarks?: string) {
      this['activity-uuid'] = activityUUID;
      this.subjects = subjects;
      this.remarks = remarks;
    }
  }

  export class TaskDependency {
    "task-uuid": string;
    remarks?: string;

    constructor(taskUUID: string, remarks?: string) {
      this['task-uuid'] = taskUUID;
      this.remarks = remarks;
    }
  }

  export class EventTiming {
    "on-date"?: OnDate;
    "within-date-range"?: WithinDateRange;
    "at-frequency"?: AtFrequency;

    constructor(on?: Date, within?: [Date, Date], frequency?: [number, TimeUnit]) {
      if (on !== undefined) this['on-date'] = {date: on};
      if (within !== undefined) this['within-date-range'] = {start: within[0], end: within[1]};
      if (frequency !== undefined) this['at-frequency'] = {period: frequency[0], unit: frequency[1]};
    }
  }

  interface OnDate {
    date: Date; //DateTimeWithTimeZoneDatatype
  }

  interface WithinDateRange {
    start: Date;
    end: Date;
  }

  interface AtFrequency {
    period: number;
    unit: TimeUnit;
  }

  export class Origin {
    actors: OriginActor[] = [];
    "related-tasks"?: RelatedTask[];
  }

  export class OriginActor {
    type: OriginActorType;
    "actor-uuid": string;
    "role-id"?: string;
    props?: Prop[];
    links?: Link[];

    constructor(type: OriginActorType, actorUUID: string, roleID?: string) {
      this.type = type;
      this['actor-uuid'] = actorUUID;
      this['role-id'] = roleID;
    }
  }

  export class RelatedTask {
    "task-uuid": string;
    props?: Prop[];
    links?: Link[];
    "responsible-parties"?: ResponsibleParty[];
    subjects?: AssessmentSubject[];
    "identified-subject"? : IdentifiedSubject;
    remarks?: string;

    constructor(taskUUID: string) {
        this['task-uuid'] = taskUUID;
    }
}

export class IdentifiedSubject {
    "subject-placeholder-uuid": string = uuid();
    subjects: AssessmentSubject[] = [];
}

export class Risk {
  uuid: string = uuid();
  title: string;
  description: string;
  statement: string;
  status: string | RiskStatus;
  props?: Prop[];
  links?: Link[];
  origins?: Origin[];
  "threat-ids"?: ThreatID[];
  characterizations?: Characterization[];
  "mitigating-factors"?: MitigatingFactor[];
  deadline?: Date;
  remediations?: AssessmentResponse[];
  "risk-log"?: RiskLog;
  "related-observations"?: RelatedObservation[];

  constructor(title: string, description: string, statement: string, status: string | RiskStatus) {
    this.title = title;
    this.description = description;
    this.statement = statement;
    this.status = status;
  }
}

export class AssessmentResponse {
  uuid: string = uuid();
  lifecycle: string | RemediationIntent;
  title: string;
  description: string;
  props?: Prop[];
  links?: Link[];
  origins?: Origin[];
  "required-assets"?: RequiredAsset[];
  tasks?: Task[];
  remarks?: string;

  constructor(lifecycle: string | RemediationIntent, title: string, description: string, remarks?: string) {
    this.lifecycle = lifecycle,
    this.title = title
    this.description = description;
    this.remarks = remarks
  }
}

export class RequiredAsset {
  uuid: string = uuid();
  description: string;
  subjects?: SubjectReference[];
  title?: string;
  props?: Prop[];
  links?: Link[];
  remarks?: string;

  constructor(description: string, title?: string, remarks?: string) {
    this.description = description;
    this.title = title;
    this.remarks = remarks;
  }
}

export class MitigatingFactor {
  uuid: string = uuid();
  description: string;
  "implementation-uuid"?: string;
  props?: Prop[];
  links?: Link[];
  subjects?: SubjectReference[];

  constructor(description: string) {
    this.description = description;
  }
}

export class Characterization {
  origin: Origin;
  facets: Facet[] = [];
  props?: Prop[];
  links?: Link[];

  constructor(origin: Origin) {
    this.origin = origin;
  }
}

export class Facet {
  name: string;
  system: string | FacetNamingSystem;
  value: string;
  props?: Prop[];
  links?: Link[];
  remarks?: string;

  constructor(name: string, value: string, system: string| FacetNamingSystem) {
    this.name = name;
    this.value = value;
    this.system = system;
  }
}

export interface RelatedObservation {
  "observation-uuid": string //UUID
}

export interface RiskLog {
  entries: RiskLogEntry[];
}

export class RiskLogEntry {
  uuid: string = uuid();
  start: Date = new Date(); //DateTimeDataType
  end?: Date; //DateTimeDataType
  title?: string;
  description?: string;
  props?: Prop[];
  links?: Link[];
  "logged-by"?: LoggedBy[];
  "status-change": RiskStatus
  "related-responses"?: RelatedTask[];
  remarks?: string;
}


export class LoggedBy {
  "party-uuid": string; 
  "role-id"?: string; //TokenDataType

  constructor(partyUUID: string) {
      this['party-uuid'] = partyUUID;
  }
}

export class ThreatID {
  id: string;
  system: string | ThreatTypeIDSystem;
  href?: string;

  constructor(id: string, system: string | ThreatTypeIDSystem) {
    this.id = id;
    this.system = system;
  }
}

export class Finding {
  uuid: string = uuid();
  title: string;
  description: string;
  target: FindingTarget;
  props?: Prop[];
  links?: Link[];
  origins?: Origin[];
  "implementation-statement-uuid"?: string;
  "related-observations"?: RelatedObservation[];
  "related-risks"?: AssociatedRisk[];
  remarks?: string;

  constructor(title: string, description: string, target: FindingTarget, remarks?: string) {
    this.title = title;
    this.description = description;
    this.target = target;
    this.remarks = remarks;
  }
}

export class FindingTarget {
  type: FindingTargetType;
  "target-id": string;
  status: ObjectiveStatus;
  title?: string;
  description?: string;
  props?: Prop[];
  links?: Link[];
  "implementation-status"?: ImplementationStatus;
  remarks?: string; 

  constructor(type: FindingTargetType, targetID: string, status: ObjectiveStatus) {
    this.type = type;
    this['target-id'] = targetID;
    this.status = status;
  }
}

export class ObjectiveStatus {
  state: ObjectiveStatusState;
  reason?: string | ObjectiveStatusReason;
  remarks?: string;

  constructor(state: ObjectiveStatusState, reason?: string | ObjectiveStatusReason, remarks?: string) {
    this.state = state;
    this.reason = reason;
    this.remarks = remarks;
  }
}

export interface AssociatedRisk {
  "risk-uuid": string;
}
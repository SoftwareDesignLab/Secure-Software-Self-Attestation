import { v4 as uuid } from 'uuid';
import { Prop, Link, Part, SystemComponent } from './common'
import { ResponsibleParty } from './metadata';

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

  export class SubjectReference {
    "subject-uuid": string = uuid();
    type: SubjectIDType;
    title?: string;
    props?: Prop[];
    links?: Link[];
    remarks?: string;

    constructor(type: SubjectIDType) {
      this.type = type;
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
    parts?: Part[];
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
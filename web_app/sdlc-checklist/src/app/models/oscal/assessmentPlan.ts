import { v4 as uuid } from 'uuid';
import { Metadata, Prop, Link, AssessmentSubjectType, AssessmentSubject, ReviewedControls } from './common';

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
    if (title !== undefined) newPart.title = title;
    if (uuid !== undefined) newPart.uuid = uuid;
    if (ns !== undefined) newPart.ns = ns;
    if (class_ !== undefined) newPart.class = class_;
    if (props !== undefined) newPart.props = props;
    if (prose !== undefined) newPart.prose = prose;
    if (parts !== undefined) newPart.parts = parts;
    if (links !== undefined) newPart.links = links;
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

//TODO local definitions
// class LocalDefinitions {

// }

//TODO assessment assets - will be important for 3rd party tests
// class AssessmentAssets {

// }

export class AssessmentPlan {
  uuid: string = uuid();
  metadata: Metadata = new Metadata();
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
  
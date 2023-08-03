import { v4 as uuid } from 'uuid';
import { Prop, Link } from './common';
import { ReviewedControls } from './assessment';
import { Metadata, BackMatter } from './metadata';
import { SystemComponent, InventoryItem, SystemUser } from './common';

export class AssessmentResults {
    uuid: string = uuid();
    metadata: Metadata = new Metadata();
    "import-ap": ImportAP = new ImportAP();
    results: Result[] = [];
    "local-definitions"?: LocalDefinitions;
    "back-matter"?: BackMatter;
}

export class ImportAP {
    href: string = ""; //URIReferenceDataType
    remarks?: string;
}

export class Result {
    uuid: string = uuid();
    title: string = "";
    description: string = ""
    start: Date = new Date(); //DateTimeDataType
    "reviewed-controls": ReviewedControls = new ReviewedControls();
    end?: Date; //DateTimeDataType
    props?: Prop[];
    links?: Link[];
    "local-definitions"?: LocalDefinitions;
    attestations?: Attestation[];
    "assessment-log"?: AssessmentLog;
    observations?: Observation[];
    risks?: Risk[];
    findings?: Finding[];
    remarks?: string;

}

export class LocalDefinition {
    components? : SystemComponent[];
    "inventory-items"?: InventoryItem[];
    users?: SystemUser[];
    "assessment-assets"?: AssessmentAsset[];
    tasks?: Task[];
}

export class AssessmentLog {
    entries: Entry[] = [];
}

export class Entry {
    uuid: string = uuid();
    start: Date = new Date(); //DateTimeDataType
    end?: Date; //DateTimeDataType
    title?: string;
    description?: string;
    props?: Prop[];
    links?: Link[];
    "logged-by"?: LoggedBy[];
    "related-tasks"?: RelatedTask[];
    remarks?: string;

}

export class LoggedBy {
    "party-uuid": string = ""; 
    "role-id": string = ""; //TokenDataType
}

export class RelatedTask {
    "task-uuid": string = uuid();
    props?: Prop[];
    links?: Link[];
    "responsible-parties"?: ResponsibleParty[];
    subjects?: Subject[];
    "identified-subject"? : IdentifiedSubject;
}

export class IdentifiedSubject {
    "subject-placeholder-uuid": string = uuid();
    "subjects": Subject[] = [];
}
import { v4 as uuid } from 'uuid';
import { Prop, Link } from './common';
import { ReviewedControls, AssessmentSubject, SubjectReference, AssessmentAsset } from './assessment';
import { Metadata, BackMatter, ResponsibleParty } from './metadata';
import { SystemComponent, InventoryItem, SystemUser } from './common';

export enum ObservationMethod {
    "EXAMINE",
    "INTERVIEW",
    "TEST",
    "UNKNOWN"
}

export enum ObservationType {
    "ssp-statement-issue",
    "control-objective",
    "mitigation",
    "finding",
    "historic"
}

export enum RiskStatus {
    "open",
    "investigating",
    "remediating",
    "deviation-requested",
    "deviation-approved",
    "closed"
}

export enum FindingTargetType {
    "statement-id",
    "objective-id"
}

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

export class Finding {
    uuid: string = uuid();
    title: string;
    description: string;
    target: FindingTarget;
    props?: Prop[];
    links?: Link[];
    //TODO
}

export class FindingTarget {
    type: FindingTargetType;
    "target-id": string;
    status: FindingTargetStatus;
    //TODO
}

export class FindingTargetStatus {
    //TODO
}

export class Risk {
    uuid: string = uuid();
    title: string;
    description: string;
    statement: string;
    status: RiskStatus | string;
    props?: Prop[];
    links?: Link[];
    origins?: Origin[];
    "threat-ids"?: ThreatID[];
    characterizations?: Characterization[];
    "mitigating-factors"?: MitigatingFactor[];
    deadline?: Date; //DateTimeDataType
    remediations?: Response[];
    "risk-log"?: RiskLog;
    "related-observations"?: RelatedObservation[];

    constructor(title: string, description: string, statement: string, status: RiskStatus | string) {
        this.title = title;
        this.description = description;
        this.statement = statement;
        this.status = status;
    }
}


export class LocalDefinitions {
    components? : SystemComponent[];
    "inventory-items"?: InventoryItem[];
    users?: SystemUser[];
    "assessment-assets"?: AssessmentAsset[];
    tasks?: Task[];
}

export class Attestation {
    parts: AssessmentPart[] = [];
    "responsible-parties": ResponsibleParty[];
}

export class AssessmentPart {
    uuid: string = uuid();
    name: string;
    ns?: string;
    class?: string;
    title?: string;
    props?: Prop[];
    prose?: string;
    parts?: AssessmentPart[];
    links?: Link[];

    constructor(name: string) {
        this.name = name;
    }
}

export class Observation {
    uuid: string = uuid();
    description: string;
    methods: string[] | ObservationMethod[];
    collected: Date = new Date(); //DateTimeWithTimezoneDataType
    title?: string;
    props?: Prop[];
    links?: Link[];
    types?: ObservationType[];
    origins?: Origin[];
    subjects?: SubjectReference[];
    "relevant-evidence"?: RelevantEvidence[];
    expires?: Date; //DateTimeWithTimezoneDataType
    remarks?: string;

    constructor(description: string, methods: string[] | ObservationMethod[]) {
        this.description = description;
        this.methods = methods;
    }
}



export class AssessmentLog {
    entries: AssessmentLogEntry[] = [];
}

export class AssessmentLogEntry {
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

export class RiskLog {
    entries: RiskLogEntry[] = [];
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
    "status-change": RiskStatus;
    "related-responses": RiskResponseReference[];
    remarks?: string;
}

export class RiskResponseReference {
    "response-uuid": string = uuid();
    props?: Prop[];
    links?: Link[];
    "related-tasks": RelatedTask[];
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
    subjects?: AssessmentSubject[];
    "identified-subject"? : IdentifiedSubject;
}

export class IdentifiedSubject {
    "subject-placeholder-uuid": string = uuid();
    "subjects": AssessmentSubject[] = [];
}
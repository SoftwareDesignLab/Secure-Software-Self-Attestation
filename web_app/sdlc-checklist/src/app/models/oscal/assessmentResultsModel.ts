import { v4 as uuid } from 'uuid';
import { Prop, Link, SystemComponentStatus, SystemComponentType } from './common';
import { ReviewedControls, AssessmentSubject, AssessmentAsset, Task, AssessmentPart, Origin, Risk, Finding, RelatedTask, LoggedBy } from './assessment';
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

export class AssessmentResults {
    uuid: string = uuid();
    metadata: Metadata = new Metadata();
    "import-ap": ImportAP = new ImportAP("");
    results: Result[] = [];
    "local-definitions"?: LocalDefinitions;
    "back-matter"?: BackMatter;

    addResult(result: Result) {
        this.results.push(result);
    }
}

export class ImportAP {
    href: string; //URIReferenceDataType
    remarks?: string;

    constructor(href: string) {
        this.href = href;
    }
}

export class Result {
    uuid: string = uuid();
    title: string;
    description: string;
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

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
}

export class Observation {
    uuid: string = uuid();
    description: string;
    methods: Array<string | ObservationMethod>;
    collected: Date;
    title?: string;
    props?: Prop[];
    links?: Link[];
    types?: Array<string | ObservationType>;
    origins?: Origin[];
    subjects?: AssessmentSubject[];
    "relevant-evidence"?: RelevantEvidence[];
    expires?: Date;
    remarks?: string;

    constructor(description: string, methods: Array<string | ObservationMethod>, collected: Date) {
        this.description = description;
        this.methods = methods;
        this.collected = collected;
    }
}

export class RelevantEvidence {
    description: string;
    href?: string;
    props?: Prop[];
    links?: Link[];
    remarks?: string;

    constructor(description: string, href?: string, remarks?: string) {
        this.description = description;
        this.href = href;
        this.remarks = remarks;
    }
}

export class Attestation {
    parts: AssessmentPart[] = [];
    "responsible-parties"?: ResponsibleParty[];

    addPart(name: string, title?: string, class_?: string, ns?: string, prose?: string, props?: Prop[], parts?: AssessmentPart[], links?: Link[]) {
        let newPart = new AssessmentPart(name);
        if (title !== undefined) newPart.title = title;
        if (ns !== undefined) newPart.ns = ns;
        if (class_ !== undefined) newPart.class = class_;
        if (props !== undefined) newPart.props = props;
        if (prose !== undefined) newPart.prose = prose;
        if (parts !== undefined) newPart.parts = parts;
        if (links !== undefined) newPart.links = links;
        this.parts.push(newPart);
    }
}

export class LocalDefinitions {
    components? : SystemComponent[];
    "inventory-items"?: InventoryItem[];
    users?: SystemUser[];
    "assessment-assets"?: AssessmentAsset[];
    tasks?: Task[];

    addSystemComponent(type: SystemComponentType, title: string, description: string, status: SystemComponentStatus, props?: Prop[], links?: Link[]) {
        let newComponent = new SystemComponent(type, title, description, status);
        if (props !== undefined) newComponent.props = props;
        if (links !== undefined) newComponent.links = links;
        this.components?.push(newComponent);
    }

    addInventoryItem(description: string, props?: Prop[], links?: Link[]) {
        let newInventoryItem = new InventoryItem(description);
        if (props !== undefined) newInventoryItem.props = props;
        if (links !== undefined) newInventoryItem.links = links;
        this["inventory-items"]?.push(newInventoryItem);
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

/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import catalog from '../defaultCatalog';
import {v4 as uuidv4} from 'uuid';
import { Prop } from './propertyModel';
import { CatalogShell, ControlShell, GroupShell, MetadataShell, PropShell } from './catalogModel';
import { BehaviorSubject } from 'rxjs';

export class Form {
    uuid: string = uuidv4();
    name: string;
    static nameIndex = 1;
    catalogs: Catalog[] = [];
    subject: Subject = new Subject();

    constructor() {
        this.name = "Attestation " + Form.nameIndex++;
        this.addCatalog();
    }

    /**
     * Adds a new catalog to the form
     * @param jsonData The data of the catalog to add, defaults to the starting catalog
     */
    addCatalog(jsonData: CatalogShell = catalog as CatalogShell) {
        this.catalogs.push(new Catalog(jsonData));
    }

    /**
     * Removes a specified catalog
     * @param uuid The uuid of the catalog to remove
     */
    removeCatalog(uuid: string) {
        this.catalogs.splice(this.catalogs.findIndex((catalog) => {return catalog.uuid === uuid}), 1);
    }

    isDefaultPresent(): boolean {
        return true;
    }

    serialize(metadata: any): any {
        return {
            uuid: this.uuid,
            metadata: metadata,
            "import-ssp": {href: ""},
            "reviewed-controls": {"control-selections": this.catalogs.map((catalog) => catalog.serialize())},
            "assessment-subjects": this.subject.serialize()
        };
    }
}

export class Catalog {
    groups: Group[] = [];
    controlsByGroups: Map<string, number> = new Map<string, number>();
    uuid: string;
    expanded: boolean = true;
    metadata: CatalogMetadata;

    constructor(jsonData: CatalogShell) {
        this.uuid = jsonData.uuid;
        jsonData.groups.forEach((group) => {this.groups.push(new Group(group, this.uuid))})
        this.metadata = new CatalogMetadata(jsonData.metadata);
    }

    toggleExpansion() {
        this.expanded = !this.expanded;
    }

    serialize() {
        let props = [new Prop({name: "Catalog ID", value: this.uuid, class:"catalog"} as PropShell), 
                     new Prop({name: "Catalog Name", value : this.metadata.title, class:"catalog"} as PropShell)]
        let include: {"control-id": string}[] = [];
        let exclude: {"control-id": string}[] = [];
        this.groups.forEach((group) => {
            group.controls.forEach((control) => {
                if (control.result !== Result.blank) {
                    props.push(new Prop({name: control.id, value: control.stringResult, class: "Compliance Claim"} as PropShell));
                    include.push({"control-id": control.id});
                } else {
                    exclude.push({"control-id": control.id});
                }
                if (control.commentFinalized) props.push(new Prop({name: control.id, value: control.comment , class: "Attestation Claim"} as PropShell));
            })
        })
        return {props: props, "include-controls": include, "exclude-controls": exclude};
    }
}

export class Group {
    controls: Control[] = [];
    id: string;
    title: string;
    expanded: boolean = true;
    catalogUUID: string;

    constructor (jsonData: GroupShell, catalogID: string) {
        this.id = jsonData.id;
        this.title = jsonData.title;
        this.catalogUUID = catalogID
        jsonData.controls.forEach((control) => {this.controls.push(new Control(control, catalogID))})
    }

    toggleExpansion() {
        this.expanded = !this.expanded;
    }
}

export class Control {
    id: string;
    uid: string;
    title: string;
    result: Result = Result.blank;
    comment: string = "";
    commentFinalized: boolean = false;
    references: Prop[] = [];
    examples: string[] = [];
    props: Prop[] = [];
    expanded: boolean = false;

    constructor(jsonData: ControlShell, catalogID: string) {
        this.id = jsonData.id;
        this.uid = catalogID + ":" + jsonData.id;
        this.title = jsonData.title;
        jsonData.parts?.forEach((part) => {if (part.part_class === "Example") this.examples.push(part.title)});
        jsonData.props?.forEach((prop) => {
            let pClass: string = prop.class || prop.property_class || "";
            if (pClass === "Reference" || pClass === "References") {
                this.references.push(new Prop(prop));
            } else {
                this.props.push(new Prop(prop));
            }
        })
    }

    finalizeComment(comment: string) {
        this.comment = comment;
        this.commentFinalized = true;
    }

    inProgressComment(comment: string) {
        this.comment = comment;
        this.commentFinalized = false;
    }

    toggleExpansion() {
        this.expanded = !this.expanded;
    }

    isChecked() {
        return this.result !== Result.blank;
    }

    get stringResult(): string { 
        switch (this.result) {
            case Result.yes: return "yes";
            case Result.no: return "no";
            case Result.na: return "n/a";
            default: return "blank";
        }
     }
}

export class CatalogMetadata {
    title: string;
    lastModified: string;
    version: string;
    oscalVersion: string;
    published: string;

    constructor(metadata: MetadataShell) {
        this.title = metadata.title;
        this.lastModified = metadata['last-modified'];
        this.version = metadata.version;
        this.oscalVersion = metadata['oscal-version'];
        this.published = metadata.published;
    }
}

export class Subject {
    #type: BehaviorSubject<SubjectType> = new BehaviorSubject<SubjectType>(SubjectType.company);
    lines: SubjectLine[] = []

    static subjectTypeToString(type: SubjectType): string {
        switch (type) {
            case SubjectType.company: return "company";
            case SubjectType.individual: return "individual";
            case SubjectType.multiple: return "multiple";
            case SubjectType.productLine: return "productLine"
        }
    }

    static stringToSubjectType(type: string): SubjectType {
        switch (type) {
            case "individual": return SubjectType.individual;
            case "multiple": return SubjectType.multiple;
            case "productLine": return SubjectType.productLine;
            default: return SubjectType.company
        }
    }

    pruneRows() {
        switch(this.type) {
            case SubjectType.company: this.lines = []; break;
            case SubjectType.individual: case SubjectType.productLine: this.lines = [this.lines[0] || new SubjectLine()]; break;
            case SubjectType.multiple: if (this.lines.length === 0) this.lines = [new SubjectLine()];
        }
    }

    serialize() {
        return {
            type: "party",
            props: {name: "type", value: this.oscalStringType, class: "Attestation Type" },
            "include-subjects": this.lines.map((line) => {return line.serialize()}),
            "exclude-subjects": []
        }
    }
    
    get type(): SubjectType { return this.#type.getValue(); }
    get stringType(): string { return Subject.subjectTypeToString(this.#type.getValue()); }
    get oscalStringType(): string { 
        switch (this.type) {
            case SubjectType.company: return "company-wide";
            case SubjectType.individual: return "individual-product";
            case SubjectType.multiple: return "multiple-products";
            case SubjectType.productLine: return "product-line";
        }
    }
    get observableType(): BehaviorSubject<SubjectType> { return this.#type; }
    set type(type: SubjectType) { this.#type.next(type); this.pruneRows(); }
    set stringType(subject: string) { this.#type.next(Subject.stringToSubjectType(subject)); this.pruneRows(); }
}

export class SubjectLine {
    name: string = "";
    version: string = "";
    date: string = "";

    serialize() {
        return {type: "component", "subject-uuid": uuidv4(), props: [
            {name: "Product Name", value: this.name, class: "Product Info"},
            {name: "Version", value: this.version, class: "Product Info"},
            {name: "Date", value: this.date, class: "Product Info"}
        ]}
    }
}

export enum Result {
    yes,
    no,
    na,
    blank
}

export enum SubjectType {
    company,
    productLine,
    individual,
    multiple
}

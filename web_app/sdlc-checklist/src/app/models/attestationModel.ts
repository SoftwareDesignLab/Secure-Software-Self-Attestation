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
import { Subject } from './subjectModel';
import { Metadata } from './contactModel';

export class Form {
    uuid: string = uuidv4();
    name: string;
    static nameIndex = 1;
    catalogs: Catalog[] = [];
    subject: Subject = new Subject();
    catalogDataFiles: any[] = [];
    metadata: Metadata = new Metadata();

    constructor(startingCatalog: boolean = true) {
        this.name = "Attestation " + Form.nameIndex++;
        if (startingCatalog) this.addCatalog();
    }

    /**
     * Adds a new catalog to the form
     * @param jsonData The data of the catalog to add, defaults to the starting catalog
     */
    addCatalog(jsonData: CatalogShell = catalog as CatalogShell) {
        this.catalogs.push(new Catalog(jsonData));
        this.catalogDataFiles.push(jsonData);
    }

    /**
     * Removes a specified catalog
     * @param uuid The uuid of the catalog to remove
     */
    removeCatalog(uuid: string) {
        this.catalogs.splice(this.catalogs.findIndex((catalog) => {return catalog.uuid === uuid}), 1);
        this.catalogDataFiles.splice(this.catalogDataFiles.findIndex((catalog) => {return catalog.uuid === uuid}), 1);
    }

    isDefaultPresent(): boolean {
        return -1 !== this.catalogs.findIndex((checkCatalog) => {return checkCatalog.uuid === catalog.uuid})
    }

    serialize(metadata: any): any {
        return {
            uuid: this.uuid,
            metadata: metadata,
            "import-ssp": {href: ""},
            "reviewed-controls": {"control-selections": this.catalogs.map((catalog) => catalog.serialize())},
            "assessment-subjects": [this.subject.serialize()]
        };
    }

    load(json: any) {
        this.name = json.metadata.title
        this.metadata.load(json["metadata"])
        if (json["assessment-subjects"]) this.subject.load(json["assessment-subjects"][0]);
        if (json["reviewed-controls"]["control-selections"]) {
            json["reviewed-controls"]["control-selections"].forEach((catalog: any) => {
                let uuid = catalog.props?.find((prop: any) => {return prop.name === "Catalog ID"}).value;
                this.catalogs.find((catalog: Catalog) => {return catalog.uuid === uuid})?.load(catalog);
            });
        }
    }
}

export class Catalog {
    groups: Group[] = [];
    uuid: string;
    controlMap: Map<string, Control> = new Map<string, Control>();
    expanded: boolean = true;
    metadata: CatalogMetadata;

    constructor(jsonData: CatalogShell) {
        this.uuid = jsonData.uuid;
        jsonData.groups.forEach((group) => {
            let newGroup = new Group(group, this.uuid);
            this.groups.push(newGroup);
            newGroup.controls.forEach((control) => this.controlMap.set(control.id, control));
        })
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

    load(jsonData: any) {
        jsonData.props?.forEach((prop: any) => {
            if (prop.class === "Compliance Claim") {
                let control = this.controlMap.get(prop.name)
                if (control) control.stringResult = prop.value;
            } else if (prop.class === "Attestation Claim") {
                let control = this.controlMap.get(prop.name)
                if (control) control.finalizeComment(prop.value);
            }
        })
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

    set stringResult(result: string) {
        switch (result) {
            case "yes": this.result = Result.yes; break;
            case "no": this.result = Result.no; break;
            case "n/a": this.result = Result.na; break;
            default: this.result = Result.blank;
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

export enum Result {
    blank,
    yes,
    no,
    na,
}

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
import { CatalogShell, ControlShell, GroupShell, MetadataShell } from './catalogModel';

export class Form {
    uuid: string = uuidv4();
    name: string;
    static nameIndex = 1;
    catalogs: Catalog[] = [];
    flag = false;

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

    }

    isDefaultPresent(): boolean {
        return true;
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
    yes,
    no,
    na,
    blank
}

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

import { BehaviorSubject } from 'rxjs';
import catalog from '../defaultCatalog';
import {v4 as uuidv4} from 'uuid';
import { Prop } from './propertyModel';
import { CatalogShell, ControlShell, GroupShell } from './catalogModel';

export class Form {
    #uuid: string = uuidv4();
    #name: BehaviorSubject<string>;
    static nameIndex = 1;
    #catalogMap: BehaviorSubject<Map<string, Catalog>> = new BehaviorSubject<Map<string, Catalog>>(new Map<string, Catalog>);

    constructor() {
        this.#name = new BehaviorSubject<string>("Attestation " + Form.nameIndex++);
        this.addCatalog();
    }

    /**
     * Adds a new catalog to the form
     * @param jsonData The data of the catalog to add, defaults to the starting catalog
     */
    addCatalog(jsonData: CatalogShell = catalog as CatalogShell) {
        let newCatalog: Catalog = new Catalog(jsonData);
        let catalogs = this.#catalogMap.getValue();
        catalogs.set(jsonData.uuid, newCatalog);
        this.#catalogMap.next(catalogs);
    }

    /**
     * Removes a specified catalog
     * @param uuid The uuid of the catalog to remove
     */
    removeCatalog(uuid: string) {
        let catalogs = this.#catalogMap.getValue();
        if (catalogs.delete(uuid)) this.#catalogMap.next(catalogs);
    }
    get uuid(): string { return this.#uuid; }
    get catalogMap(): Map<string, Catalog> { return this.#catalogMap.getValue(); }
    get observableCatalogMap(): BehaviorSubject<Map<string, Catalog>> { return this.#catalogMap; }
    get name(): string { return this.#name.getValue(); }
    get observableName(): BehaviorSubject<string> { return this.#name; }
    set name(name: string) { this.#name.next(name); }
}

export class Catalog {
    #groups: Group[] = [];
    #controlsByGroups: Map<string, number> = new Map<string, number>();
    #uuid: string;
    #expansion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor(jsonData: CatalogShell) {
        this.#uuid = jsonData.uuid;
        jsonData.groups.forEach((group) => {this.#groups.push(new Group(group, this.#uuid))})
    }

    setExpansion(expanded: boolean) {
        this.#expansion.next(expanded);
    }

    toggleExpansion() {
        this.setExpansion(!this.expansion);
    }

    get groups(): Group[] { return this.#groups; }
    get uuid(): string { return this.#uuid; }
    get expansion(): boolean { return this.#expansion.getValue(); }
    get observableExpansion(): BehaviorSubject<boolean> { return this.#expansion; }
}

export class Group {
    #controls: Control[] = [];
    #id: string;
    #title: string;
    #expanded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    #catalogUUID: string;

    constructor (jsonData: GroupShell, catalogID: string) {
        this.#id = jsonData.id;
        this.#title = jsonData.title;
        this.#catalogUUID = catalogID
        jsonData.controls.forEach((control) => {this.#controls.push(new Control(control, catalogID))})
    }

    toggleExpansion() {
        this.expanded = !this.expanded;
    }

    get controls(): Control[] { return this.#controls; }
    get id(): string { return this.#id; }
    get title(): string { return this.#title; }
    get catalogUUID(): string { return this.#catalogUUID; }
    get expanded(): boolean { return this.#expanded.getValue(); }
    get observableExpanded(): BehaviorSubject<boolean> { return this.#expanded; }
    set expanded(expanded: boolean) { this.#expanded.next(expanded); }
}

export class Control {
    #id: string;
    #uid: string;
    #title: string;
    #result: BehaviorSubject<Result> = new BehaviorSubject<Result>(Result.blank);
    #comment: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #commentFinalized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    #references: Prop[] = [];
    #examples: string[] = [];
    #props: Prop[] = [];
    #expanded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(jsonData: ControlShell, catalogID: string) {
        this.#id = jsonData.id;
        this.#uid = catalogID + ":" + jsonData.id;
        this.#title = jsonData.title;
        jsonData.parts.forEach((part) => {if (part.part_class === "Example") this.#examples.push(part.title)});
        jsonData.props.forEach((prop) => {
            let pClass: string = prop.class || prop.property_class || "";
            if (pClass === "Reference" || pClass === "References") {
                this.#references.push(new Prop(prop));
            } else {
                this.#props.push(new Prop(prop));
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
        this.expanded = !this.#expanded;
    }

    get id(): string { return this.#id; }
    get uid(): string { return this.#uid; }
    get title(): string { return this.#title; }
    get result(): Result { return this.#result.getValue(); }
    get comment(): string { return this.#comment.getValue(); }
    get commentFinalized(): boolean { return this.#commentFinalized.getValue(); }
    get references(): Prop[] { return this.#references; }
    get examples(): string[] { return this.#examples; }
    get props(): Prop[] { return this.#props; }
    get expanded(): boolean { return this.#expanded.getValue(); }
    get observableResult(): BehaviorSubject<Result> { return this.#result; }
    get observableComment(): BehaviorSubject<string> { return this.#comment; }
    get observableCommentFinalized(): BehaviorSubject<boolean> { return this.#commentFinalized; }
    get observableExpanded(): BehaviorSubject<boolean> { return this.#expanded; }
    set result(result: Result) { this.#result.next(result); }
    set comment(comment: string) { this.#comment.next(comment); }
    set commentFinalized(commentFinalized: boolean) { this.#commentFinalized.next(commentFinalized); }
    set expanded(expanded: boolean) { this.#expanded.next(expanded); }
}

export enum Result {
    yes,
    no,
    na,
    blank
}

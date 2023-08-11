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

export class Form {
    #uuid: string = uuidv4();
    #catalogs: Map<string, Catalog> = new Map<string, Catalog>();

    constructor() {
        this.addDefaultCatalog();
    }

    /**
     * Adds a new catalog to the form
     * @param jsonData The data of the catalog to add
     */
    addCatalogFromJSON(jsonData: any) {

    }

    /**
     * Adds the default catalog to the form
     */
    addDefaultCatalog() {

    }
    get uuid(): string { return this.#uuid; }
    get catalogs(): Map<string, Catalog>{ return this.#catalogs; }
}

export class Catalog {
    #groups: Group[] = [];
    #controlsByGroups: Map<string, number> = new Map<string, number>();
    #uuid: string;

    constructor() {

    }

    get groups(): Group[] { return this.#groups; }
    get uuid(): string { return this.#uuid; }
}

export class Group {
    #controls: Control[] = [];

    get controls(): Control[] { return this.#controls; }
}

export class Control {
    #id: string;
    #uid: string;
    #result: BehaviorSubject<Result> = new BehaviorSubject<Result>(Result.blank);
    #comment: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #commentFinalized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    #references: Prop[] = [];
    #examples: string[] = [];
    #props: Prop[] = [];

    constructor(id: string, groupUUID: string) {
        this.#id = id;
        this.#uid = groupUUID + ":" + id;
    }

    finalizeComment(comment: string) {
        this.comment = comment;
        this.commentFinalized = true;
    }

    get id(): string { return this.#id; }
    get uid(): string { return this.#uid; }
    get result(): Result { return this.#result.getValue(); }
    get comment(): string { return this.#comment.getValue(); }
    get commentFinalized(): boolean { return this.#commentFinalized.getValue(); }
    get references(): Prop[] { return this.#references; }
    get examples(): string[] { return this.#examples; }
    get props(): Prop[] { return this.#props; }
    get observableResult(): BehaviorSubject<Result> { return this.#result; }
    get observableComment(): BehaviorSubject<string> { return this.#comment; }
    get observableCommentFinalized(): BehaviorSubject<boolean> { return this.#commentFinalized; }
    set result(result: Result) { this.#result.next(result); }
    set comment(comment: string) { this.#comment.next(comment); }
    set commentFinalized(commentFinalized: boolean) { this.#commentFinalized.next(commentFinalized); }
}

export enum Result {
    yes,
    no,
    na,
    blank
}

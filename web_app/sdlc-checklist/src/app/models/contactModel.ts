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
import { v4 as uuidv4 } from 'uuid';
import { Prop } from './propertyModel';

export class Metadata {
    #title: BehaviorSubject<string> = new BehaviorSubject("");
    #published: string = "";
    "last-Modified": string = "";
    #version: string = "1.0.0";
    "oscal-Version": string = "1.0.4";
    #organization: Organization = new Organization();
    #person: Person = new Person();

    get title(): string { return this.#title.getValue(); }
    get published(): string { return this.#published; }
    get lastModified(): string { return this['last-Modified']; }
    get version(): string { return this.#version; }
    get oscalVersion(): string { return this['oscal-Version']; }
    get organization(): Organization { return this.#organization; }
    get person(): Person { return this.#person; }
    get observableTitle(): BehaviorSubject<string> { return this.#title; }
    set title(title: string) { this.#title.next(title); }
    set published(published: string) { this.published = published; }
    set lastModified(lastModified: string) { this['last-Modified'] = lastModified; }
    set version(version: string) { this.version = version; }
}

export class Party  {
    #uuid: string = uuidv4();
    #type: string;
    #name: BehaviorSubject<string> = new BehaviorSubject("");
    #address: Address = new Address();
    #props: Prop[] = [];

    constructor(type: string) {
        this.#type = type;
    }

    /**
     * Adds a new prop to the party
     * @param newClass The class of the prop
     * @param name The name of the prop
     * @param value The value of the prop
     */
    addProp(newClass: string, name: string, value: string): void {
        this.#props.push(new Prop({class: newClass, name: name, value: value}));
    }

    get uuid(): string { return this.#uuid; }
    get type(): string { return this.#type; }
    get name(): string { return this.#name.getValue(); }
    get addresses(): Address { return this.#address; }
    get props(): Prop[] { return this.#props; }
    get observableName(): BehaviorSubject<string> { return this.#name; }
    set name(name: string) { this.#name.next(name); }
}

export class Organization extends Party {
    #website: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor() {
        super("organization");
    }

    get website(): string { return this.#website.getValue(); }
    get observableWebsite(): BehaviorSubject<string> { return this.#website; }
    get propWebsite(): Prop | undefined { if (this.website) { return new Prop({class: "Producer Info", name: "website", value: this.#website.getValue()})}}
    set website(website: string) { this.#website.next(website); }
}

export class Person extends Party {
    #email: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #phone: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #title: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor() {
        super("person");
    }

    get email(): string { return this.#email.getValue(); }
    get phone(): string { return this.#phone.getValue(); }
    get title(): string { return this.#title.getValue(); }
    get observableEmail(): BehaviorSubject<string> { return this.#email; }
    get observablePhone(): BehaviorSubject<string> { return this.#phone; }
    get observableTitle(): BehaviorSubject<string> { return this.#title; }
    get propTitle(): Prop | undefined { if (this.title) { return new Prop({class: "Contact Info", name: "title", value: this.title})}}
    set email(email: string) { this.#email.next(email); }
    set phone(phone: string) { this.#phone.next(phone); }
    set title(title: string) { this.#title.next(title); }
}

export class Address {
    #lines: BehaviorSubject<string>[] = [new BehaviorSubject<string>(""), new BehaviorSubject<string>("")];
    #city: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #state: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #country: BehaviorSubject<string> = new BehaviorSubject<string>("");
    #postal: BehaviorSubject<string> = new BehaviorSubject<string>("");

    get lines(): string[] { return this.#lines.map((line) => {return line.getValue();}); }
    get line1(): string { return this.#lines[0].getValue(); }
    get line2(): string { return this.#lines[1].getValue(); }
    get city(): string { return this.#city.getValue(); }
    get state(): string { return this.#state.getValue(); }
    get country(): string { return this.#country.getValue(); }
    get postal(): string { return this.#postal.getValue(); }
    get observableLine1(): BehaviorSubject<string> { return this.#lines[0]; }
    get observableLine2(): BehaviorSubject<string> { return this.#lines[1]; }
    get observableCity(): BehaviorSubject<string> { return this.#city; }
    get observableState(): BehaviorSubject<string> { return this.#state; }
    get observableCountry(): BehaviorSubject<string> { return this.#country; }
    get observablePostal(): BehaviorSubject<string> { return this.#postal; }
}

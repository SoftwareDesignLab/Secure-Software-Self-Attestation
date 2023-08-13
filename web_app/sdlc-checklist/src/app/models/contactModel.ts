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

import { v4 as uuidv4 } from 'uuid';
import { Prop } from './propertyModel';
import { PropShell } from './catalogModel';

export class Metadata {
    title: string = "";
    published: string = "";
    "last-Modified": string = "";
    version: string = "1.0.0";
    "oscal-Version": string = "1.0.4";
    organization: Organization = new Organization();
    person: Person = new Person();
}

export class Party  {
    uuid: string = uuidv4();
    type: string;
    address: Address = new Address();
    props: Prop[] = [];

    constructor(type: string) {
        this.type = type;
    }

    /**
     * Adds a new prop to the party
     * @param newClass The class of the prop
     * @param name The name of the prop
     * @param value The value of the prop
     */
    addProp(newClass: string, name: string, value: string): void {
        this.props.push(new Prop({class: newClass, name: name, value: value} as PropShell));
    }
}

export class Organization extends Party {
    website: string = "";
    name: string = "";

    constructor() {
        super("organization");
    }

    get propWebsite(): Prop | undefined { if (this.website) { return new Prop({class: "Producer Info", name: "website", value: this.website} as PropShell)} return undefined}
}

export class Person extends Party {
    email: string = "";
    phone: string = "";
    title: string = "";
    firstName: string = "";
    lastName: string = "";

    constructor() {
        super("person");
    }

    get name(): string { return this.firstName + " " + this.lastName; }
    get propTitle(): Prop | undefined { if (this.title) { return new Prop({class: "Contact Info", name: "title", value: this.title} as PropShell)} return undefined;}
}

export class Address {
    lines: string[] = ["", ""];
    city: string = "";
    state: string = "";
    country: string = "";
    postal: string = "";

    get line1(): string { return this.lines[0]; }
    get line2(): string { return this.lines[1]; }
    set line1(line: string) { this.lines[0] = line; }
    set line2(line: string) { this.lines[1] = line; }
}

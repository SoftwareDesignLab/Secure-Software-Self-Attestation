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

import { Prop } from './propertyModel';
import { PropShell } from './catalogModel';

export class Metadata {
    published: string = "";
    version: string = "1.0.0";
    oscalVersion: string = "1.0.4";
    lastModified: string = "";
    person: Person = new Person();
    organization: Organization = new Organization();

    /**
     * Loads data from serialized data
     * @param json The serialized metadata
     */
    load(json: any) {
        this.published = json.published;
        this.version = json.version;
        this.oscalVersion = json["oscal-version"];
        this.lastModified = json["last-modified"];
    }
}

export class Party  {
    uuid: string = "";
    type: string;
    addresses: Address[] = [];
    props: Prop[] = [];

    /**
     * Creates a new Party
     * @param type The type the party is
     */
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

    /**
     * Loads a party from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    load(json: any) {
        if (json.uuid instanceof String) {
            this.uuid = json.uuid;
        }
        if (json.addresses) json.addresses.forEach((address: any) => {
            let newAddress = new Address(); 
            this.addresses.push(newAddress); 
            newAddress.load(address)
        });
    }
}

export class Organization extends Party {
    websites: string[] = [];
    name: string = "";

    /**
     * Creates a new Organization object
     */
    constructor() {
        super("organization");
    }

    /**
     * Loads an organization from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    override load(json: any) {
        super.load(json);
        if (json.name) {
            this.name = json.name;
        }
        if (json.props) json.props.forEach((prop: any) => {
            if (prop.name === "website") {
                if (prop.value !== "")
                    this.websites.push(prop.value);
            } else {
                this.props.push(new Prop(prop as PropShell));
            }
        })
    }
}

export class Person extends Party {
    emails: string[] = [];
    phones: string[] = [];
    title: string = "";
    firstName: string = "";
    lastName: string = "";

    /**
     * Creates a new person object
     */
    constructor() {
        super("person");
    }

    /**
     * Loads a person from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    override load(json: any) {
        super.load(json);
        let name = json.name;
        if (name) {
            let names = name.split(" ");
            this.firstName = names[0];
            this.lastName = names.slice(1).join(" ");
        }
        if (json.props) json.props.forEach((prop: any) => {
            if (prop.name === "title") {
                this.title = prop.value;
            } else {
                this.props.push(new Prop(prop as PropShell));
            }
        })
        if (json['email-addresses']) {
            json['email-addresses'].forEach((email: string) => {this.emails.push(email)});
        }
        if (json['telephone-numbers']) {
            json['telephone-numbers'].forEach((phone: string) => {this.phones.push(phone)})
        }
    }

    get name(): string { return (this.title ? this.title + " " : '') + this.firstName + " " + this.lastName; }
    get propTitle(): Prop | undefined { if (this.title) { return new Prop({class: "Contact Info", name: "title", value: this.title} as PropShell)} return undefined;}
}

export class Address {
    lines: string[] = ["", ""];
    city: string = "";
    state: string = "";
    country: string = "";
    postal: string = "";

    /**
     * Loads an address from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    load(json: any) {
        if (json['addr-lines']) {
            this.line1 = json['addr-lines'][0];
            this.line2 = json['addr-lines'][1];
        }
        if (json.city) {
            this.city = json.city;
        }
        if (json.state) {
            this.state = json.state;
        }
        if (json.country) {
            this.country = json.country;
        }
        if (json['postal-code']) {
            this.postal = json['postal-code'];
        }
    }

    get line1(): string { return this.lines[0]; }
    get line2(): string { return this.lines[1]; }
    get str(): string { return this.line1 + (this.line2 ? ', ' + this.line2 : '') + ", " + this.city + (this.state ? ', ' + this.state : '') + ', ' + this.country + ', ' + this.postal}
    set line1(line: string) { this.lines[0] = line; }
    set line2(line: string) { this.lines[1] = line; }
}

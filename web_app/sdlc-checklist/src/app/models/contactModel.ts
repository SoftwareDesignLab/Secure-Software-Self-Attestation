/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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
    published: string = "";
    version: string = "1.0.0";
    "oscal-version": string = "1.0.4";

    /**
     * Serializes the metadata section
     * @param title The title of the form
     * @param organization The universal Organization object
     * @param person The universal Person object
     * @returns The serialized data
     */
    serialize(title: string, organization: Organization, person: Person): any {
        if (!this.published) {
            this.published = new Date().toISOString();
        }
        return {
            title: title,
            "last-modified": new Date().toISOString(),
            version: this.version,
            "oscal-version": this['oscal-version'],
            published: this.published,
            parties: [organization.serialize(), person.serialize()]
        }
    }

    /**
     * Loads data from serialized data
     * @param json The serialized metadata
     */
    load(json: any) {
        this.published = json.published;
        this.version = json.version;
        this["oscal-version"] = json["oscal-version"];
    }
}

export class Party  {
    uuid: string = uuidv4();
    type: string;
    address: Address = new Address();
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
     * Serializes the party for saving
     * @returns the serialized object
     */
    serialize(): any {
        return {
            uuid: this.uuid,
            type: this.type,
            addresses: [this.address.serialize()],
            props: this.props
        }
    }

    /**
     * Loads a party from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    load(json: any, modify: boolean = true): boolean {
        let flag: boolean = true;
        if (json.uuid instanceof String) {
            flag = flag && (json.uuid === "" || this.uuid === "" || json.uuid === this.uuid)
            if (modify && json.uuid !== "")
                this.uuid = json.uuid;
        }
        if (json.addresses[0]) flag = flag && this.address.load(json.addresses[0], modify);
        return flag;
    }
}

export class Organization extends Party {
    website: string = "";
    name: string = "";

    /**
     * Creates a new Organization object
     */
    constructor() {
        super("organization");
    }

    /**
     * Serializes the Organization object
     * @returns The serialized data
     */
    override serialize() {
        let org = {
            ...super.serialize(), 
            name: this.name}
        if (this.propWebsite) {
            if (!org.props.find((prop: Prop) => prop.name === "website")) org.props.push(this.propWebsite);
            org = {...org, "links": [this.linkWebsite]}
        }
        return org;
    }

    /**
     * Loads an organization from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    override load(json: any, modify: boolean = true): boolean {
        let flag = super.load(json, modify);
        if (json.name) {
            flag = flag && (json.name === "" || this.name === "" || json.name === this.name)
            if (modify && json.name !== "")
                this.name = json.name;
        }
        if (json.props) json.props.forEach((prop: any) => {
            if (prop.name === "website") {
                flag = flag && (prop.value === "" || this.website === "" || prop.value === this.website)
                if (modify && prop.value !== "")
                    this.website = prop.value;
            } else {
                if (modify)
                    this.props.push(new Prop(prop as PropShell));
            }
        })
        return flag;
    }

    get linkWebsite(): {href: string, rel: string} | undefined { if (this.website) { return {href: this.website, rel: "website"}} return undefined}
    get propWebsite(): Prop | undefined { if (this.website) { return new Prop({class: "Producer Info", name: "website", value: this.website} as PropShell)} return undefined}
}

export class Person extends Party {
    email: string = "";
    phone: string = "";
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
     * Serialized the person data into an object for saving
     * @returns The serialized object
     */
    override serialize() {
        let person = {
            ...super.serialize(),
            name: this.name
        }
        if (this.propTitle) {
            if (!person.props.find((prop: Prop) => prop.name === "title")) person.props.push(this.propTitle);
        }
        if (this.email) person = {...person, "email-addresses": [this.email]}
        if (this.phone) person = {...person, "telephone-numbers": [this.phone]}
        return person;
    }

    /**
     * Loads a person from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    override load(json: any, modify: boolean = true): boolean {
        let flag = super.load(json, modify);
        let name = json.name;
        if (name) {
            let names = name.split(" ");
            flag = flag && (names[0] === "" || this.firstName === "" || names[0] === this.firstName);
            if (modify && names[0] !== "")
                this.firstName = names[0];
            flag = flag && (names[1] === "" || this.lastName === "" || name[1] === this.lastName);
            if (modify && names[1] !== "")
                this.lastName = names.slice(1).join(" ");
        }
        if (json.props) json.props.forEach((prop: any) => {
            if (prop.name === "title") {
                flag = flag && (prop.value === "" || this.title === "" || prop.value === this.title)
                if (modify && prop.value !== "")
                    this.title = prop.value;
            } else {
                if (modify)
                    this.props.push(new Prop(prop as PropShell));
            }
        })
        if (json['email-addresses'] && json['email-addresses'][0]) {
            flag = flag && (json['email-addresses'][0] === "" || this.email === "" || json['email-addresses'][0] === this.email);
            if (modify && json["email-addresses"][0] !== "")
                this.email = json['email-addresses'][0]
        }
        if (json['telephone-numbers'] && json['telephone-numbers'][0]) {
            flag = flag && (json['telephone-numbers'][0] == "" || this.phone === "" || json['telephone-numbers'][0] === this.phone);
            if (modify && json['telephone-numbers'][0] !== "")
                this.phone = json['telephone-numbers'][0]
        }
        return flag;
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

    /**
     * Serialized the address into an object
     * @returns The serialized address
     */
    serialize() {
        return {
            "addr-lines": [this.lines[0], this.lines[1]],
            city: this.city,
            state: this.state,
            country: this.country,
            "postal-code": this.postal
        }
    }

    /**
     * Loads an address from a file
     * @param json The serialized data
     * @param modify Whether or not to save data (used to check if there are conflicts with existing data)
     * @returns Whether any data will be overwritten
     */
    load(json: any, modify: boolean = true): boolean {
        let flag = true;
        if (json['addr-lines']) {
            flag = flag && (json['addr-lines'][0] === "" || this.line1 === "" || json['addr-lines'][0] === this.line1) 
                        && (json['addr-lines'][1] === "" || this.line2 === "" || json['addr-lines'][1] === this.line2);
            if (modify && json['addr-lines'][0] !== "") {
                this.line1 = json['addr-lines'][0];
            }
            if (modify && json['addr-lines'][1] !== "") {
                this.line2 = json['addr-lines'][1];
            }
        }
        if (json.city) {
            flag = flag && (json.city === "" || this.city === "" || json.city === this.city);
            if (modify && json.city !== "")
                this.city = json.city;
        }
        if (json.state) {
            flag = flag && (json.state === "" || this.state === "" || json.state === this.state);
            if (modify && json.state !== "" )
                this.state = json.state;
        }
        if (json.country) {
            flag = flag && (json.country === "" || this.country === "" || json.country === this.country);
            if (modify && json.country !== "")
                this.country = json.country;
        }
        if (json['postal-code']) {
            flag = flag && (json["postal-code"] === "" || this.postal === "" || json['postal-code'] === this.postal);
            if (modify && json['postal-code'] !== "")
                this.postal = json['postal-code'];
        }
        return flag;
    }

    get line1(): string { return this.lines[0]; }
    get line2(): string { return this.lines[1]; }
    set line1(line: string) { this.lines[0] = line; }
    set line2(line: string) { this.lines[1] = line; }
}

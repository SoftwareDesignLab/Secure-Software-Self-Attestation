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
import { BehaviorSubject } from "rxjs";
import {v4 as uuidv4} from 'uuid';

export class Subject {
    #type: BehaviorSubject<SubjectType> = new BehaviorSubject<SubjectType>(SubjectType.company);  //This should NOT be accessed directly outside of the getters and setters
    lines: SubjectLine[] = []

    /**
     * Converts a subjectType enum to a string
     * @param type The type to convert
     * @returns The string
     */
    static subjectTypeToString(type: SubjectType): string {
        switch (type) {
            case SubjectType.company: return "company";
            case SubjectType.individual: return "individual";
            case SubjectType.multiple: return "multiple";
            case SubjectType.productLine: return "productLine"
        }
    }

    /**
     * Converts strings to subject type enums
     * @param type The string to convert
     * @returns The subjectType
     */
    static stringToSubjectType(type: string): SubjectType {
        switch (type) {
            case "individual": case "individual-product": return SubjectType.individual;
            case "multiple": case "multi product": case "multiple-products": return SubjectType.multiple;
            case "product-line": case "productLine": return SubjectType.productLine;
            default: return SubjectType.company
        }
    }

    /**
     * Deletes rows that are not necessary for the current subject type
     */
    pruneRows() {
        switch(this.type) {
            case SubjectType.company: this.lines = []; break;
            case SubjectType.individual: case SubjectType.productLine: this.lines = [this.lines[0] || new SubjectLine()]; break;
            case SubjectType.multiple: if (this.lines.length === 0) this.lines = [new SubjectLine()];
        }
    }

    /**
     * Serializes the data within the subject
     * @returns The serialized object
     */
    serialize() {
        return {
            type: "party",
            props: [{ name: "type", value: this.oscalStringType, class: "Attestation Type" }],
            "include-subjects": this.lines.map((line) => {return line.serialize()}),
            "exclude-subjects": []
        }
    }

    /**
     * Loads data from a serialized object
     * @param json The object to load from
     */
    load(json: any) {
        if (json.props?.find)
            this.stringType = json.props?.find((prop: any) => {return prop.name === "type"})?.value;
        this.lines = [];
        json["include-subjects"]?.forEach((subject: any) => {
            let line = new SubjectLine();
            subject?.props.forEach((prop: any) => {
                switch (prop.name) {
                    case "Product Name": line.name = prop.value; break;
                    case "Version": line.version = prop.value; break;
                    case "Date": line.date = prop.value; break;
                }
            });
            this.lines.push(line);
        });
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

    /**
     * Serializes the subjectLines for saving
     * @returns The serialized object
     */
    serialize() {
        return {type: "component", "subject-uuid": uuidv4(), props: [
            {name: "Product Name", value: this.name, class: "Product Info"},
            {name: "Version", value: this.version, class: "Product Info"},
            {name: "Date", value: this.date, class: "Product Info"}
        ]}
    }
}

export enum SubjectType {
    company,
    productLine,
    individual,
    multiple
}
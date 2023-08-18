import { BehaviorSubject } from "rxjs";
import {v4 as uuidv4} from 'uuid';

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
            case "individual": case "individual-product": return SubjectType.individual;
            case "multiple": case "multi product": case "multiple-products": return SubjectType.multiple;
            case "product-line": case "productLine": return SubjectType.productLine;
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
            props: [{ name: "type", value: this.oscalStringType, class: "Attestation Type" }],
            "include-subjects": this.lines.map((line) => {return line.serialize()}),
            "exclude-subjects": []
        }
    }

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
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
import { CatalogShell, ControlShell, GroupShell, MetadataShell, PropShell } from './catalogModel';
import { Subject } from './subjectModel';
import { Metadata } from './contactModel';
import { AssessmentResultsShell } from './resultsModel';

export class Form {
    uuid: string = "";
    name: string = "";
    catalogs: Catalog[] = [];
    subject: Subject = new Subject();
    catalogDataFiles: any[] = [];
    metadata: Metadata = new Metadata();


    /**
     * Adds a new catalog to the form
     * @param jsonData The data of the catalog to add, defaults to the starting catalog
     */
    addCatalog(jsonData: CatalogShell) {
        this.catalogs.push(new Catalog(jsonData));
        this.catalogDataFiles.push(jsonData);
    }

    /**
     * Takes seialized data and unpacks it into the page
     * @param json The data to load, should be the "assessment-plan" part of a serialized file
     */
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

    loadResults(results: AssessmentResultsShell) {
        this.name = results.metadata.title;
        this.uuid = results.uuid;
        this.metadata.load(results.metadata);
    }
}

export class Catalog {
    groups: Group[] = [];
    uuid: string;
    controlMap: Map<string, Control> = new Map<string, Control>();
    expanded: boolean = true;
    metadata: CatalogMetadata;

    /**
     * Creates a new catalog given a catalog file
     * @param jsonData The catalog file's data
     */
    constructor(jsonData: CatalogShell) {
        this.uuid = jsonData.uuid;
        jsonData.groups.forEach((group) => {
            let newGroup = new Group(group, this.uuid);
            this.groups.push(newGroup);
            newGroup.getAllControls().forEach((control) => this.controlMap.set(control.id, control));
        })
        this.metadata = new CatalogMetadata(jsonData.metadata);
    }

    /**
     * Toggles whether or not the catalog should appear expanded when loaded
     */
    toggleExpansion() {
        this.expanded = !this.expanded;
    }

    isChecked() {
        return Array.from(this.controlMap.values()).some((control) => {return control.isChecked()});
    }

    /**
     * Loads data from a save file into the attestation
     * @param jsonData The saved data, specifically a single object from within the "control-selections" array
     */
    load(jsonData: any) {
        jsonData.props?.forEach((prop: any) => {
            if (prop.class === "Compliance Claim") {
                let control = this.controlMap.get(prop.name)
                if (control) control.stringResult = prop.value;
            } else if (prop.class === "Attestation Claim") {
                let control = this.controlMap.get(prop.name)
                if (control) control.comment = prop.value;
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
    groups: Group[] = [];

    /**
     * Creates a new group from a blank catalog
     * @param jsonData The group's section of the catalog
     * @param catalogID The parent catalog's uuid
     */
    constructor (jsonData: GroupShell, catalogID: string) {
        this.id = jsonData.id;
        this.title = jsonData.title;
        this.catalogUUID = catalogID
        jsonData.controls?.forEach((control) => {this.controls.push(new Control(control, catalogID))})
        jsonData.groups?.forEach((group) => {this.groups.push(new Group(group, catalogID))})
    }

    /**
     * Toggles whether the group should appear expanded
     */
    toggleExpansion() {
        this.expanded = !this.expanded;
    }

    isCheckedR() {
        return this.getAllControls().some((control) => {return control.isCheckedR()});
    }

    getAllControls(): Control[] {
        let controls: Control[] = [];
        this.controls.forEach((control) => {controls = controls.concat(control.getAllControls())})
        this.groups.forEach((group) => {controls = controls.concat(group.getAllControls())})
        return controls;
    }
}

export class Control {
    id: string;
    uid: string;                            //Of the form "<catalogUUID>:<controlID>"
    title: string;
    result: Result = Result.blank;
    comment: string = "";
    references: Prop[] = [];
    examples: string[] = [];
    props: Prop[] = [];
    expanded: boolean = false;
    controls: Control[] = [];

    /**
     * Creates a control from a blank catalog file
     * @param jsonData The data about the control
     * @param catalogID The parent catalog's uuid
     */
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
        jsonData.controls?.forEach((control) => {this.controls.push(new Control(control, catalogID))})
    }

    /**
     * Determines if a response has been given for the control
     * @returns Whether a response has been given for the control
     */
    isChecked() {
        return this.result !== Result.blank;
    }

    isCheckedR() {
        return this.getAllControls().some((control) => {return control.isChecked()});
    }

    getAllControls(): Control[] {
        let controls: Control[] = [this];
        this.controls.forEach((control: Control) => {controls = controls.concat(control.getAllControls())});
        return controls;
    }

    /**
     * Gets the result as a string
     */
    get stringResult(): string { 
        switch (this.result) {
            case Result.yes: return "yes";
            case Result.no: return "no";
            case Result.na: return "n/a";
            default: return "blank";
        }
    }

    get filenameResult(): string {
        switch (this.result) {
            case Result.yes: return "/assets/check.png";
            case Result.no: return "/assets/x.png";
            case Result.na: return "/assets/na.png";
            default: return "";
        }
    }

    /**
     * Sets the result using a string
     */
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

    /**
     * Creates a catalog metadata object
     * @param metadata The catalog's metadata
     */
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

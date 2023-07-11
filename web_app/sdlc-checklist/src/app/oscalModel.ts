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
import {GroupComponent} from './group/group.component'
import { ChecklistItemComponent } from './control/control.component';


    export interface Oscal {
        catalog: Catalog;
    }


    export interface metaData {
        title: string;
        published: string;
        "last-modified": string;
        version: string;
        "oscal-version": string;
        revisions: any
        "document-ids": any;
        props: any;
        links: any;
        roles: any;
        locations: any;
        parties: party[];
        "responsible-parties": any;
        remarks: any;
    }


    export interface Catalog {
        uuid: string;
        metadata: metaData;
        groups: GroupComponent[];
        controls: ChecklistItemComponent[];
        "back-matter": any;
        params: any;
        
    }

    export interface part {
        id: string;
        name: string;
        ns: string;
        class: string;
        title: string;
        props: any;
        prose: string;
        parts: part[];
        links: any;
    }
    
    export interface party  {
        uuid: string;
        type: string;
        name: string;
        "short-name": string;
        "external-ids": any;
        props: any;
        links: any;
        "email-addresses": any;
        "telephone-numnbers": any;
        "adsresses": any;
        "location-uuids": any;
        "member-of-organizations": any;
        remarks: any;
    }
    
    export interface parameter {
        id: string;
        class: string;
        "depends-on": string;
        props: any;
        links: any;
        label: string;
        usage: string;
        constrints: any;
        guidelines: any;
        values: any;
        select: any;
        remarks: any;

    }



    export class ControlInfo {
        comment: String;
        selection: String;
        finalized: Boolean = false;

    
        constructor(comment: string = "", selection: string = "no-selection") {
            this.comment = comment;
            this.selection = selection;
        }
    }




    
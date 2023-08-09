/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States DePartment of Homeland Security.
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
 * FITNESS FOR A PartICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { GroupComponent } from '../../group/group.component'
import { ChecklistItemComponent } from '../../control/control.component';
import { Metadata } from './metadata';

//TODO convert to class structures 
//TODO move GroupComponent and ChecklistItemComponent data into here

    export interface CatalogFileFormat {
        catalog: Catalog;
    }

    export interface Catalog {
        uuid: string;
        metadata: Metadata;
        groups: GroupComponent[];
        controls: ChecklistItemComponent[];
        "back-matter": any;
        params: any;
        
    }
    
    export interface Party  {
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
    
    
    
    export interface CatalogData{
            catalogs: Catalog[];
    }


    export class ControlAttestation {
        comment: string;
        selection: string;
        finalized: Boolean = false;
        showRollable: boolean = false;

    
        constructor(comment: string = "", selection: string = "no-selection") {
            this.comment = comment;
            this.selection = selection;
        }
    }

    export class GroupInfo{
        showRollable: boolean = true;
    }




    
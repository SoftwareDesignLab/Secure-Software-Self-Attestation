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
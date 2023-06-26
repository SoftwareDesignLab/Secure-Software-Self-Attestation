import {GroupComponent} from './group/group.component'


    export interface Oscal {
        catalog: catalog
    }


    export interface metaData {
        title: String;
        "last-modified": Date;
        version: String;
        "oscal-version": String;
        published: String;
    }


    export interface catalog {
        uuid: string
        metadata: metaData;
        groups: GroupComponent[];
    }


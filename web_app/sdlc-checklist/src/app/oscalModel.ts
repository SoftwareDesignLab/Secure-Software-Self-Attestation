import {GroupComponent} from './group/group.component'


    export interface metaData {
        title: String;
        last_modified: String;
        version: String;
        oscal_version: String;
        published?: String;
    }


    export interface Oscal {
        uuid: string
        metadata: metaData;
        groups: GroupComponent[];
    }
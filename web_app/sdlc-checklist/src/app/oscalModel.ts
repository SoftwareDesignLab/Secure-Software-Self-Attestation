import {GroupComponent} from './group/group.component'


    export interface metaData {
        title: String;
        last_modified: Date;
        version: String;
        oscal_version: String;
        published?: String;
    }


    export interface Oscal {
        uuid: string
        metadata: metaData;
        groups: GroupComponent[];
    }
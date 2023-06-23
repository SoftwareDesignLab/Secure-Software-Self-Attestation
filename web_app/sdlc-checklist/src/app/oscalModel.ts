import {GroupComponent} from './group/group.component'

export class Oscal {
    uuid?: String;
    metadata: metaData;
    groups?: Array<GroupComponent>;

    constructor(){
        this.metadata = new metaData();
    }

    public Check_metaData(){
        let isValid: boolean = true;
        if(this.metadata.title == undefined){
            isValid = false
            console.log("Missing MetaData: title ")
        }
        if(this.metadata.last_modified == undefined){
            isValid = false
            console.log("Missing MetaData: last_modified ")
        }
        if(this.metadata.version == undefined){
            isValid = false
            console.log("Missing MetaData: version ")
        }
        if(this.metadata.oscal_version == undefined){
            isValid = false
            console.log("Missing MetaData: oscal_version ")
        }
        if(this.metadata.published == undefined){
            isValid = false
            console.log("Missing MetaData: published ")
        }
        return isValid ;
    }
}



    export class metaData {
        title?: String;
        last_modified?: String;
        version?: String;
        oscal_version?: String;
        published?: String;
    }


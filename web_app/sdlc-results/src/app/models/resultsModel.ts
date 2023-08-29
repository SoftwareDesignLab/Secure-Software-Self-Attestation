import { MetadataShell, PartShell, PropShell } from "./catalogModel";

export interface AssessmentResultsShell {
    uuid: string;
    metadata: MetadataShell;
    results: ResultShell[];
    "import-ap": {href: string};
}

export interface ResultShell {
    uuid: string;
    title: string;
    description: string;
    start: string;
    "reviewed-controls": ReviewedControlsShell;
    attestations: AttestationShell;
}

export interface ReviewedControlsShell {
    props: PropShell[];
    links: {href: string}[];
    "control-selections": {};
}

export interface AttestationShell {
    "responsible-parties": ResponsiblePartiesShell[];
    parts: PartShell[]
}

export interface ResponsiblePartiesShell {
    "role-id": string;
    "party-uuids": string[];
}
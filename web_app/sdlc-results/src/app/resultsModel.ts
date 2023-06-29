export interface Control {
  "control-id": string;
}

export interface ControlSelection {
  "include-all": object | undefined;
  "include-controls": Control[];
}

export interface Links {
  href: string;
}

export interface Props {
  name: string;
  value: string;
}

export interface Parts {
    name: string;
    class: string;
    title: string;
    prose: string;
    props: Props[];
}

export interface Attestation {
    "responsible-parties": object[]; //TODO define this type
    parts: Parts[];
}

export interface ReviewedControls {
  props: Props[];
  links: Links[];
  "control-selections": ControlSelection[];
}

export interface Result {
  uuid: string;
  title: string;
  description: string;
  start: string;
  "reviewed-controls": ReviewedControls;
  attestations: Attestation[];
}

export interface Metadata {
  title: string;
  "last-modified": string;
  version: string;
  "oscal-version": string;
}

export interface AssessmentResults {
  uuid: string;
  metadata: Metadata;
  "import-ap": object;
  results: Result[];
}

export function getControlCatalogFromReviewedControls(reviewedControls: ReviewedControls): string {
  // find the prop with the name "Catalog Name" and return its value
  const catalogNameProp = reviewedControls.props.find((prop) => prop.name === "Catalog Name");
  if (catalogNameProp) {
    return catalogNameProp.value;
  }
  return "";
}
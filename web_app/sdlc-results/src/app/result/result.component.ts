import { Component, Input } from '@angular/core';
import { Result, getControlCatalogFromReviewedControls } from '../resultsModel';

interface ExtraData {
  [key: string]: any;
}

interface ControlResults {
  fullName: string;
  compliance: boolean | undefined;
  explanation: string | undefined;
  extra: ExtraData;
}

interface ControlDict {
  [key: string]: ControlResults;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  @Input() result: Result = {} as Result;
  catalogName: string = "Not associated with a catalog";
  links: string[] = [];
  controls: ControlDict = {};

  // TODO inefficient to call this every time anything changes
  ngOnChanges(): void {
    if (this.result) {
      this.catalogName = getControlCatalogFromReviewedControls(this.result['reviewed-controls']);
      if (this.result['reviewed-controls'].links){
        this.links = this.result['reviewed-controls'].links.map((link: any) => link.href);
      }
      if (this.result.attestations) {
        for (const attestation of this.result.attestations) {
          for (const part of attestation.parts) {
            if (!this.controls[part.name]) {
              this.controls[part.name] = {} as ControlResults;
              this.controls[part.name].extra = {} as ExtraData;
            }
            if (part.props) {
              this.controls[part.name].fullName = part.props.find((prop: any) => prop.name === "Control Name")?.value || part.title;
            }
            if (part.class === "Compliance") {
              this.controls[part.name].compliance = part.prose === "Compliant";
            }
            else if (part.class === "Explanation") {
              this.controls[part.name].explanation = part.prose;
            }
            else {
              this.controls[part.name].extra[part.class] = part.prose;
            }
          }
        }
      }
    }
  }
}

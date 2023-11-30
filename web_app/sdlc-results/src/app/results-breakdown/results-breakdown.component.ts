import { Component, Input } from '@angular/core';
import { AssessmentResults, Attestation } from '../resultsModel';

interface Breakdown {
  totalCompliant: number;
  totalNonCompliant: number;
  totalNotApplicable: number;
  writtenPercent: string;
}

@Component({
  selector: 'app-results-breakdown',
  templateUrl: './results-breakdown.component.html',
  styleUrls: ['./results-breakdown.component.css']
})
export class ResultsBreakdownComponent {
  @Input() results: AssessmentResults | undefined;
  @Input() catalogs: any[] = [];

  getResultsBreakdown(): Breakdown {
    if (this.results === undefined) return {
      totalCompliant: 0,
      totalNonCompliant: 0,
      totalNotApplicable: 0,
      writtenPercent: "0"
    } as Breakdown;

    let totalCompliant = 0
    let totalNonCompliant = 0
    let totalNotApplicable = 0
    let totalwritten = 0

    // console.log(this.results.results[0].attestations[0] as Attestation);
    // console.log(this.results.results[0].attestations.length);

    for (let i = 0; i < this.results.results[0].attestations.length; i++) {
      let attestation = new Attestation(this.results.results[0].attestations[i]);
      let [compliant, nonCompliant, notApplicable, written] = attestation.complianceMetrics();

      totalCompliant += compliant;
      totalNonCompliant += nonCompliant;
      totalNotApplicable += notApplicable;
      totalwritten += written;
    }


    return {
      totalCompliant: totalCompliant,
      totalNonCompliant: totalNonCompliant,
      totalNotApplicable: totalNotApplicable,
      writtenPercent: ((totalwritten / (totalCompliant + totalNonCompliant + totalNotApplicable)) * 100).toFixed(2)
    } as Breakdown;
  }

  
}

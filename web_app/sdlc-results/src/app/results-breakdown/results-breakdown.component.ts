import { Component, Input } from '@angular/core';
import { AssessmentResults, Attestation } from '../resultsModel';

interface Breakdown {
  totalCompliant: number;
  totalNonCompliant: number;
  totalNotApplicable: number;
  percentChecked: number;
}

@Component({
  selector: 'app-results-breakdown',
  templateUrl: './results-breakdown.component.html',
  styleUrls: ['./results-breakdown.component.css']
})
export class ResultsBreakdownComponent {
  @Input() results: AssessmentResults | undefined;

  getResultsBreakdown(): Breakdown {
    if (this.results === undefined) return {
      totalCompliant: 0,
      totalNonCompliant: 0,
      totalNotApplicable: 0,
      percentChecked: 0
    } as Breakdown;

    let totalCompliant = 0
    let totalNonCompliant = 0
    let totalNotApplicable = 0
    let percentChecked = 0

    for (let attestation in this.results.results[0].attestations) {
      console.log(attestation)
      // let [compliant, nonCompliant, notApplicable] = attestation.complianceMetrics();
    }


    return {
      
    } as Breakdown;
  }
}

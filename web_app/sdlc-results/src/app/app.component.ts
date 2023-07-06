import { Component } from '@angular/core';
import { AssessmentResults } from './resultsModel';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  assessmentResults: AssessmentResults | undefined;

  onFileSelected(jsonData: any): void { //TODO jsonData should be of type Catalog
    this.assessmentResults = jsonData["assessment-results"];
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results-metadata',
  templateUrl: './results-metadata.component.html',
  styleUrls: ['./results-metadata.component.css']
})
export class ResultsMetadataComponent {
  @Input() metadata: any;
}

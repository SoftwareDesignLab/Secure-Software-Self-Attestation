import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rollable',
  templateUrl: './rollable.component.html',
  styleUrls: ['./rollable.component.css']
})
export class RollableComponent {
  @Input() description: any;
  @Input() examples: any;
  @Input() subControls: any;
  @Input() parts: any;

  hasDescription(): boolean {
    return this.description !== undefined;
  }

  hasExamples(): boolean {
    return this.examples !== undefined;
  }

  hasSubControls(): boolean {
    return this.subControls !== undefined;
  }

  hasParts(): boolean {
    return this.parts !== undefined;
  }
}
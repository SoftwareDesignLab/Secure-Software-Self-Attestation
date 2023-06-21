import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ChecklistItemComponent {
  @Input() id: any;
  @Input() title: any;
  @Input() class: any;
  @Input() params: any;
  @Input() parts: any;
  @Input() links: any;
  @Input() props: any;
  @Input() controls: any;
  showRollable = false;

  toggleRollable() {
    this.showRollable = !this.showRollable;
  }

  getDescription() {
    if (this.props) {
      // props are objects. find the first prop that has the class "description"
      const descriptionProp = this.props.find((prop: any) => prop.class === 'Description');
      if (descriptionProp) return descriptionProp.value;
    }
    return undefined;
  }

  getExamples() {
    if (this.parts) {
      // parts are objects. find all parts that have the class "Example"
      return this.parts.filter((part: any) => part.class === 'Example');
    }
  }
}
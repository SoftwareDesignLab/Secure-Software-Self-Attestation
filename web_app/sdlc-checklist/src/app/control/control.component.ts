import { Component, Input, Output, EventEmitter} from '@angular/core';

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
  @Input() uuid: any;
  showRollable = false;
  isChecked = false;
  userComment: string = ""
  @Output() update = new EventEmitter();
  UID: any; //Unique ID for this control for the program


  ngOnInit(){
    this.UID = this.uuid + '-' + this.id
  }

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
      return this.parts.filter((part: any) => part.part_class === 'Example');
    }
  }

  getReferences() {
    if (this.props) {
      // parts are objects. find all parts that have the class "Example"
      return this.props.filter((prop: any) => prop.property_class === 'Reference');
    }
  }

  toggleCheck(){
    this.isChecked = !this.isChecked;
    this.update.emit();
  }
  getCheck(){
    return this.isChecked;
  }
  onKey(event: any) { // without type info
    this.userComment = event.target.value;
  }
}
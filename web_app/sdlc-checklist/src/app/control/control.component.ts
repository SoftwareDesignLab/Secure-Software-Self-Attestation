import { Component, Input, Output, EventEmitter} from '@angular/core';
import { timeInterval } from 'rxjs';

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
  @Output() update = new EventEmitter();
  selection: String = "no-selection";
  showRollable = false;
  @Input() uuid: any;
  UID: any; //Unique ID for this control for the program
  comment: string = "";
  popup: Boolean = false;


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

  getComment(): String {
    let textbox = document.getElementById(this.id + '-comment');
    if (textbox instanceof HTMLInputElement) {
      return textbox.value;
    }
    return "";
  }

  isChecked(): boolean {
    return this.selection !== "no-selection";
  }

  select(selection: String) {
    if (this.selection === "no-selection") {
      this.popup = true;
    }
    this.selection = selection
  }

  save() {
    let text = document.getElementById("comment")
    if (text instanceof HTMLTextAreaElement)
      this.comment = text.value;
  }

  done() {
    this.save();
    this.cancel();
  }

  cancel() {
    this.popup = false;
  }

  del() {
    this.comment = "";
    this.cancel();
  }

  deploy() {
    this.popup = true;
  }
}
import { Component, Input, ViewChildren, QueryList} from '@angular/core';
import { ChecklistItemComponent } from '../control/control.component'

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() id: any;
  @Input() title: any;
  @Input() description: any;
  @Input() controls: any;
  @ViewChildren(ChecklistItemComponent) childComponents!: QueryList<ChecklistItemComponent>;
  showComponents = true;

  toggleComponents() {
    this.showComponents = !this.showComponents;
    if (!this.showComponents) {
      this.hideChildRollable();
    }
  }
  setComponents(truth: boolean) {
    if (!truth) {
      this.hideChildRollable();
    }
    this.showComponents = truth;
  }
  hideChildRollable() {
    this.childComponents.forEach((child) => {
      child.showRollable = false;
    })
  }
}

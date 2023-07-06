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
  @Input() catalogUUID: any;
  @ViewChildren(ChecklistItemComponent) childComponents!: QueryList<ChecklistItemComponent>;
  showComponents = true;
  UID: any;  //Unique ID for this control for the program


  ngOnInit(){
    this.UID = this.catalogUUID + '-' + this.id
  }

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

  areAllChildrenChecked(): boolean {
    if (this.childComponents === undefined) {return false;}
    for (let i = this.childComponents.length - 1; i>=0; i--) {
      let child = this.childComponents.get(i);
      if (child instanceof ChecklistItemComponent) {
<<<<<<< HEAD
        if (!child.isChecked()) {
          return false;
=======
        let box = document.getElementById('checkbox-'+ child.UID);
        if (box instanceof HTMLInputElement) {
          if (!box.checked) {
            return false;
          }
>>>>>>> main
        }
      }
    }
    return true;
  }

  setAllChildrenSelection(selection: String): void {
    this.childComponents.forEach((child) => {
<<<<<<< HEAD
      child.selection = selection;
=======
      let box = document.getElementById('checkbox-' + child.UID);
      if(box instanceof HTMLInputElement) {
        box.checked = truth;
        if(child.getCheck()!=truth)
        child.toggleCheck();
      }
>>>>>>> main
    })
  }

  setAllChildrenToParent(): void {
    let parent = document.getElementById("group-checkall-" + this.id);
    if (parent instanceof HTMLInputElement) {
      this.setAllChildren(parent.checked);
    }
  }

  update() {
    let status = this.areAllChecked();
    let parent = document.getElementById("group-checkall-" + this.id);
    if (parent instanceof HTMLInputElement) {
      parent.checked = status;
    }
  }
}

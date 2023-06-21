import { Component, Input } from '@angular/core';

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
  showComponents = true;

  toggleComponents() {
    this.showComponents = !this.showComponents;
  }
}

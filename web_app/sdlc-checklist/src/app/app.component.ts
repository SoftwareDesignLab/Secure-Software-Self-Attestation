import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  catalogData: any;
  showComponentsArray: any;
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  
  onFileSelected(jsonData: any): void {
    this.catalogData = jsonData;
  }

  setAllGroupExpansion(toSet: boolean): void {
    this.childComponents.forEach((child) => {
      child.showComponents = toSet;
    });
  }
}
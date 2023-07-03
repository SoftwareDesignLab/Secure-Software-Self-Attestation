import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { ChecklistItemComponent } from './control/control.component';
import catalog from './defaultCatalog';

interface Catalog {
  uuid: string;
  metadata: object;
  groups: GroupComponent[];
  controls: ChecklistItemComponent[];
}

interface CatalogData {
  catalogs: Catalog[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  catalogData: CatalogData = {catalogs: []};
  showComponentsArray: any;
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  
  ngOnInit(): void {
    this.catalogData.catalogs.push(catalog as Catalog);    
  }

  onFileSelected(jsonData: any): void {
    this.catalogData.catalogs.push(jsonData);
  }

  setAllGroupExpansion(toSet: boolean): void {
    this.childComponents.forEach((child) => {
      child.setComponents(toSet);
    });
  }

}
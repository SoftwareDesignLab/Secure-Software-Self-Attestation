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
  hiddenCatalogs = new Set<String>();
  permanent = new Set<String>(["d152b49c-39b4-4765-a961-75051dcf2293"]);
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  
  ngOnInit(): void {
    this.catalogData.catalogs.push(catalog as Catalog);    
  }

  onFileSelected(jsonData: any): void {
    this.catalogData.catalogs.push(jsonData);
  }

  setAllGroupExpansion(toSet: boolean, uuid: String): void {
    this.childComponents.forEach((child) => {
      if (child.catalogUUID === uuid) {
        child.setComponents(toSet);
      }
    });
  }

  toggleExpansion(uuid: String): void {
    if (this.hiddenCatalogs.has(uuid)) {
      this.hiddenCatalogs.delete(uuid);
    } else {
      this.hiddenCatalogs.add(uuid);
    }
  }

  isShown(uuid: String): boolean {
    return !this.hiddenCatalogs.has(uuid);
  }

  removeCatalog(uuid: String): void {
    let catalogs = this.catalogData.catalogs
    catalogs = catalogs.splice(catalogs.findIndex((value)=>{value.uuid === uuid}))
  }

  isRemovable(uuid: String): boolean {
    return !this.permanent.has(uuid);
  }
}
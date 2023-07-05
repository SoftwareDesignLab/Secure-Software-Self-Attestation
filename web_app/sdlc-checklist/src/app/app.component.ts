import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';
import catalog from './defaultCatalog';
import { Catalog } from './oscalModel';
import { notifyService } from './notify.service';

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
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  constructor(private service: notifyService){}
  
  ngOnInit(): void {
    this.catalogData.catalogs.push(catalog as Catalog);    
  }
  onFileSelected(jsonData: any): void {
    if (this.catalogData.catalogs.findIndex((value) => {return value.uuid === jsonData.uuid;}) !== -1) // Prevents uploading the same file twice
      return;
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
    let catalogs = this.catalogData.catalogs;
    console.log("Removing " + uuid);
    catalogs.splice(catalogs.findIndex((value)=>{return value.uuid === uuid}), 1);
  }

  restoreDefaultCatalog(): void {
    this.catalogData.catalogs.unshift(catalog as Catalog);   
  }
  
  isDefaultPresent(): boolean {
    let index = this.catalogData.catalogs.findIndex((value)=>{return value.uuid === catalog.uuid});
    return index >= 0;
  }
}

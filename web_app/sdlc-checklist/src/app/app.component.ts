import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { ChecklistItemComponent } from './control/control.component';
import catalog from './defaultCatalog';
import { Router } from '@angular/router';
import { AttestationDataService } from './attestation-data.service';

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
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  showNav = false;

  constructor(private router: Router, private attestationService: AttestationDataService ){}
  
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

  changePage(page: string){
    this.showNav = !this.showNav;
    this.router.navigate([page]);
  }

  toggleNav(): void {
    this.showNav = !this.showNav;
  }

  getLinkName(catalog: Catalog): String {
    let metadata: any = catalog.metadata;
    if (metadata.title) {
      return metadata.title;
    }
    return catalog.uuid;
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

  visitedAttestation(){
    if(this.attestationService.visited()){
      return true
    }
    return false;
  }

}


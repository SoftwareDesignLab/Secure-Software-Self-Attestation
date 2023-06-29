import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { ChecklistItemComponent } from './control/control.component';
import catalog from './defaultCatalog';
import { MatDialog } from '@angular/material/dialog';
import { AttestationComponent } from './attestation/attestation.component';

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

  constructor(private dialogRef: MatDialog){}
  
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

  openDialog(){
    this.dialogRef.open(AttestationComponent, 
      {width: '600px'});
  }

}
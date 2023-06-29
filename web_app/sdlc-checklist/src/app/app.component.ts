import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { ChecklistItemComponent } from './control/control.component';
import catalog from './defaultCatalog';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
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
  dialogRef!: MatDialogRef<AttestationComponent>;
  constructor(private dialog: MatDialog){}
  
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
    this.dialogRef = this.dialog.open(AttestationComponent, {
      width: '50%',
    });
    
  }


}
import { Component, ViewChildren, QueryList } from '@angular/core';
import { GroupComponent } from '../group/group.component';
import { ChecklistItemComponent } from '../control/control.component';
import catalog from '../defaultCatalog';
import { AttestationDataService } from '../attestation-data.service';
import { attestationComment } from '../attestationForm';

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
  selector: 'app-attestation-page',
  templateUrl: './attestation-page.component.html',
  styleUrls: ['./attestation-page.component.css']
})
export class AttestationPageComponent {

  catalogData: CatalogData = {catalogs: []};
  showComponentsArray: any;
  hiddenCatalogs: any
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";
  showNav = false;
  completed = false

  selectedValue: string;
  info: any;

  constructor(public attestationService: AttestationDataService){
      this.selectedValue = attestationService.getdata(0).getSelectedValue;
      this.info = attestationService.getdata(0).getInfo;
      this.catalogData = this.attestationService.getdata(0).getCatalogs;
      this.hiddenCatalogs = this.attestationService.getdata(0).getHiddenCatalogs();
  }


  ngOnInit(): void {
    this.attestationService.seen();
    this.catalogData = this.attestationService.getdata(0).getCatalogs;
  }

  AttestationCompleted(){
    if(this.attestationService.getdata(0).submitable()){
      this.completed=true;
    }
    return this.completed;
  }

  updateSelect(){
    this.attestationService.getdata(0).setSelectedValue(this.selectedValue);
  }

  addRow(){
    this.info.push(new attestationComment)
  }

  removeRow(){
    this.info.pop();
  }

  onKey(event: any, attest: attestationComment, target: string) { 
    if(target==="name") {
      attest.addName(event.target.value);
    } else if (target==="version") {
      attest.addVersion(event.target.value);
    } else if (target==="date") {
      attest.addDate(event.target.value);
    }
  }


  onFileSelected(jsonData: any): void {
    this.attestationService.getdata(0).onFileSelected(jsonData);
  }

  setAllGroupExpansion(toSet: boolean, uuid: String): void {
    this.childComponents.forEach((child) => {
      if (child.catalogUUID === uuid) {
        child.setComponents(toSet);
      }
    });
  }


  toggleExpansion(uuid: String): void {
    this.attestationService.getdata(0).toggleExpansion(uuid);
  }

  isShown(uuid: String): boolean {
    return !this.hiddenCatalogs.has(uuid);
  }

  removeCatalog(uuid: String): void {
    this.attestationService.getdata(0).removeCatalog(uuid);
  }

  restoreDefaultCatalog(): void {
    this.attestationService.getdata(0).restoreDefaultCatalog();
  }
  
  isDefaultPresent(): boolean {
    let index = this.catalogData.catalogs.findIndex((value)=>{return value.uuid === catalog.uuid});
    return index >= 0;
  }

}

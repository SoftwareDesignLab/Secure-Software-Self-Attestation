import { Component, QueryList, ViewChildren } from '@angular/core';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';
import { Catalog, ControlInfo } from '../oscalModel';
import { GroupComponent } from '../group/group.component';
import catalog from '../defaultCatalog';



interface CatalogData {
  catalogs: Catalog[];
}
@Component({
  selector: 'app-attestation',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent {

  catalogData: CatalogData = {catalogs: []};
  showComponentsArray: any;
  hiddenCatalogs = new Set<String>();
  @ViewChildren(GroupComponent) childComponents!: QueryList<GroupComponent>;
  control: string = "Ungrouped Controls";



  private selectedValue: string = ''; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private position: any;

  constructor (){
    this.info.push(new attestationComment);
    this.catalogData.catalogs.push(catalog as Catalog);    
  }


  setPosition(pos: number){
    this.position = pos;
   }

   get getPosition(){
    return this.position;
   }
  

  addRow(){
    this.info.push(new attestationComment)
  }

  removeRow(){
    this.info.pop();
  }

  get getSelectedValue(){
    return this.selectedValue;
  }

  setSelectedValue(value: string){
    this.selectedValue = value;
  }

  get getInfo(){
    return this.info;
  }


  submitable(){
    if(this.selectedValue=='company'){
      return true;
    }
    return this.info[0].isFilled();
  }


  // Catalogs Methods

  get getCatalogs(){
    return this.catalogData;
  }


  
  onFileSelected(jsonData: any): void {
    if (this.catalogData.catalogs.findIndex((value) => {return value.uuid === jsonData.uuid;}) !== -1) // Prevents uploading the same file twice
      return;
    this.catalogData.catalogs.push(jsonData);
  }

  removeCatalog(uuid: String): void {
    let catalogs = this.catalogData.catalogs;
    console.log("Removing " + uuid);
    catalogs.splice(catalogs.findIndex((value)=>{return value.uuid === uuid}), 1);
  }

  restoreDefaultCatalog(): void {
    this.catalogData.catalogs.unshift(catalog as Catalog);   
  }

  getHiddenCatalogs(){
    return this.hiddenCatalogs;
  }

  toggleExpansion(uuid: String): void {
    if (this.hiddenCatalogs.has(uuid)) {
      this.hiddenCatalogs.delete(uuid);
    } else {
      this.hiddenCatalogs.add(uuid);
    }
  }



 
    
}

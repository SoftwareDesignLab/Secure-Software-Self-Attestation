/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
import { Component, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { GroupComponent } from './group/group.component';
import catalog from './defaultCatalog';
import { Router, NavigationEnd  } from '@angular/router';
import { AttestationDataService } from './attestation-data.service';
import { notifyService } from './notify.service';
import { ChecklistItemComponent } from './control/control.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { ViewportScroller } from '@angular/common';
import { filter, takeUntil  } from 'rxjs/operators';
import { Subject } from 'rxjs'




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
  @ViewChild(CatalogProcessingComponent) catalogProcessingComponent!: CatalogProcessingComponent;
  control: string = "Ungrouped Controls";
  showNav = false;
  showComponents = false;


  constructor(private router: Router, private attestationService: AttestationDataService ){}
  
 ngOnInit(){
  this.catalogData = this.attestationService.getdata(0).getCatalogs;

 }

 get getForms(){
  return this.attestationService.getRawData;

}

  changePage(page: string){
    this.showNav = !this.showNav;
    this.router.navigate([page]);
  }

  changeAttestion(position: number){
    this.attestationService.setView(position);
    this.changePage('contact-info');
    this.changePage('attestation-form');
    this.toggleNav();
    }
  

  newForm(){
    this.attestationService.addform();
    console.log(this.attestationService.getRawData.length);
    this.changePage("attestation-form");
  }

  deleteForm(position: number){
    let firsthalf = this.attestationService.forms.slice(0,position);
    let secondhalf = this.attestationService.forms.slice(position+1);
    this.attestationService.forms = firsthalf.concat(secondhalf);

    let newPos = 0;
    this.attestationService.forms.forEach(child => {
    child.setIndex(newPos);
    newPos = newPos+1;
    });
  }


  // Experimental Navtree change page method, Does not work as intended


  /*
  gotoLocation(page: string, location: string) {

    this.showNav = !this.showNav;
  
    const unsubscribe$ = new Subject<void>();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(unsubscribe$)
      )
      .subscribe(() => {
        setTimeout(() => {
          const element = document.getElementById(location);
          if (element) {
            element.scrollIntoView({ behavior: 'auto' });
          }
          unsubscribe$.next(); // Unsubscribe after the first navigation
          unsubscribe$.complete();
        }, 0);
      });
  
    this.router.navigate([page]);
  
  }
  */



  toggleNav(): void {
    this.showNav = !this.showNav;
    let nav = document.getElementById('nav');
    if (nav instanceof HTMLElement) {
      if (this.showNav) {
        nav.classList.add('nav-opening');
        nav.classList.remove('nav-closing');
      } else {
        nav.classList.add('nav-closing');
        nav.classList.remove('nav-opening');
      }
    }
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
    if(this.attestationService.checkVisited()){
      return true
    }
    return false;
  }

  showNavTree(){
    return(this.attestationService.getdata(0).submitable());
  }

  toggleComponents(){
    this.showComponents = !this.showComponents;
    if (!this.showComponents) {
    }
  }
}


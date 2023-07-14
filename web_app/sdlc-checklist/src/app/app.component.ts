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
  @ViewChild(CatalogProcessingComponent) catalogProcessingComponent!: CatalogProcessingComponent;
  showNav = false;
  expandedTree = false;

  constructor(private router: Router, private attestationService: AttestationDataService ){}
  
  ngOnInit(){
    this.catalogData = this.attestationService.getdata(0).getCatalogs
  }

  changePage(page: string, fragment?: string){
    this.toggleNav();
    if (fragment) {
      this.router.navigate([page], {fragment: fragment});
    } else {
      this.router.navigate([page])
    }
  }

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
        this.expandedTree = false;
      }
    }
  }

  toggleNavTree(): void {
    this.expandedTree = !this.expandedTree;
  }

  getLinkName(catalog: Catalog): string {
    let metadata: any = catalog.metadata;
    if (metadata.title) {
      return metadata.title;
    }
    return catalog.uuid;
  }

  alert(message: string) {
    alert(message);
  }

  getSubLinks(): Set<{name: string, fragment: string}> {
    let listOLinks: Set<{name: string, fragment: string}> = new Set();
    this.catalogData.catalogs.forEach((catalog) => {
      listOLinks.add({name: this.getLinkName(catalog), fragment: "catalog-" + catalog.uuid});
    });
    listOLinks.add({name: "Upload new catalog / Generate Report", fragment: "upload"});
    return listOLinks;
  }
}


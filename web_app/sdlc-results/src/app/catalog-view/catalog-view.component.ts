import { Component, Input, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

// import '@web-comp/core';
// import '@web-comp/json-viewer';


@Component({
  selector: 'app-catalog-view',
  templateUrl: './catalog-view.component.html',
  styleUrls: ['./catalog-view.component.css']
})
export class CatalogViewComponent {
  @Input() catalog: any = {};
  // @ViewChild('jsonView') jsonView: any;

  // ngOnChanges() {
  //   this.jsonView.nativeElement.setConfig({data: this.catalog})
  // }

  downloadCatalog(): void {
    console.log(this.catalog.metadata.title);
    let blob = new Blob([JSON.stringify(this.catalog, null, 2)], {type: "application/json"});
    saveAs(blob, this.catalog.metadata.title.replaceAll(" ", "_") + ".json");
  }
}

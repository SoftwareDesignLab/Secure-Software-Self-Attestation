import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-info',
  templateUrl: './catalog-info.component.html',
  styleUrls: ['./catalog-info.component.css']
})
export class CatalogInfoComponent {
  @Input() uuid: any;
  @Input() metadata: any;
  @Input() groups: any;
}

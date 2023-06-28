import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  catalogData: any;
  control: string = "Ungrouped Controls";
  
  onFileSelected(jsonData: any): void {
    this.catalogData = jsonData;
  }
}
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-catalog-processing',
  templateUrl: './catalog-processing.component.html',
  styleUrls: ['./catalog-processing.component.css'],
})
export class CatalogProcessingComponent {
  @Input() accept = '.json';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      //TODO verify that the file is an OSCAL Catalog
      this.handleFile(file);
      console.log('File selected:', file);
    } else {
      alert('Please upload an OSCAL Catalog JSON file.');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      this.handleFile(file);
      console.log('File dropped:', file);
    } else {
      alert('Please drop an OSCAL Catalog JSON file.');
    }
  }

  private isJsonFile(file: File): boolean {
    return file.type === 'application/json' || file.name.endsWith('.json');
  }

  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result as string);
      this.fileSelected.emit(json);
    };
    reader.readAsText(file);
  }
}
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
import { Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results-upload',
  templateUrl: './results-upload.component.html',
  styleUrls: ['./results-upload.component.css']
})
export class ResultsUploadComponent {
  @Input() accept = '.json';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    let input = document.getElementById("file");
    if (input instanceof HTMLInputElement) {
      input.value = "";
    }
    if (file && this.isJsonFile(file)) {
      // Process the JSON file
      //TODO verify that the file is an OSCAL Assessment Results
      this.handleFile(file);
      console.log('File selected:', file);
    } else {
      alert('Please upload an OSCAL Assessment Results JSON file.');
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
      alert('Please drop an OSCAL Assessment Results JSON file.');
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

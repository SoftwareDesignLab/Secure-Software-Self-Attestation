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
import { Injectable } from '@angular/core';
import { attestationComment } from './attestationForm';

@Injectable({
  providedIn: 'root'
})
export class AttestationDataService {

  private selectedValue: string = 'company'; 
  private info: Array<attestationComment> = new Array<attestationComment>;
  private submit: boolean = false;

  constructor() {
    this.info.push(new attestationComment);
   }

  getSelectedValue(){
    return this.selectedValue;
  }

  getInfo(){
    return this.info;
  }

  getSubmit(){
    return this.submit
  }

  setSelectedValue(data: string){
    this.selectedValue = data;
  }

  setInfo(data: Array<attestationComment>){
    this.info = data;
  }

  toggleSubmit(){
    this.submit = true;
  }
}

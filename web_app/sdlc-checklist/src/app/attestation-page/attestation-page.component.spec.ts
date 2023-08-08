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


import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationPageComponent } from './attestation-page.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CatalogProcessingComponent } from '../catalog-processing/catalog-processing.component';
import { AttestationDataService } from '../services/attestation-data.service';
import { FormsModule } from '@angular/forms';
import { CatalogInfoComponent } from '../catalog-info/catalog-info.component';
import { GroupComponent } from '../group/group.component';
import { ChecklistItemComponent } from '../control/control.component';




describe('AttestationPageComponent', () => {
  let component: AttestationPageComponent;
  let fixture: ComponentFixture<AttestationPageComponent>;
  let attestationDataService: AttestationDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttestationPageComponent,
                      CatalogProcessingComponent,
                      CatalogInfoComponent,
                      GroupComponent,
                      ChecklistItemComponent ],
      imports:       [SimpleNotificationsModule.forRoot({
                        position: ['bottom', 'right']
                      }),
                      FormsModule
                      
              ],
      providers: [
        AttestationDataService
          ]
    })
    .compileComponents();
    attestationDataService = TestBed.inject(AttestationDataService);
    attestationDataService.addform();
    attestationDataService.setView(0);

    fixture = TestBed.createComponent(AttestationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

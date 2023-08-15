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


import { AttestationDataService } from '../services/attestation-data.service';

import { Prop } from '../models/assessmentPlan';
import { Catalog } from '../models/catalogModel';
import catalog from '../defaultCatalog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupComponent } from './group.component';
import { SelectControlValueAccessor } from '@angular/forms';

describe('GroupComponent', () => {
  let group: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let attestationDataService: AttestationDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupComponent ],
    })
    .compileComponents();

    attestationDataService = TestBed.inject(AttestationDataService);
    attestationDataService.addform();
    attestationDataService.setView(0);
    fixture = TestBed.createComponent(GroupComponent);

    group = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(group).toBeTruthy();
  });

  it('Toggle Children of groups', () => {
    group.setComponents(false);
    group.toggleComponents();
    let childArray = group.childComponents.toArray()
    childArray.forEach(child => {
      expect(child.showRollable).toEqual(true)  });
    });


    it('check all children', () => {
      group.setAllChildrenSelection("check")
      expect(group.areAllChildrenChecked()).toEqual(true);
    });


});

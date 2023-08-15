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

import { RollableComponent } from './rollable.component';

describe('RollableComponent', () => {
  let component: RollableComponent;
  let fixture: ComponentFixture<RollableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Filled Rollable', () => {
    component.description = "anything";
    component.examples = "anything";
    component.subControls = "anything";
    component.references = "anything";
    expect(component.hasDescription()).toEqual(true);
    expect(component.hasExamples()).toEqual(true);
    expect(component.hasSubControls()).toEqual(true);
    expect(component.hasReferences()).toEqual(true);
  });


});

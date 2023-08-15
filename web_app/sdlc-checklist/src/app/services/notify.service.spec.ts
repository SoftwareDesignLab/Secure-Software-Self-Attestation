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
import { TestBed } from '@angular/core/testing';

import { notifyService } from './notify.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

describe('notifyService', () => {
  let service: notifyService;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [SimpleNotificationsModule.forRoot({
          position: ['bottom', 'right']
        })]    });
    service = TestBed.inject(notifyService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test all notifications', () => {
    spyOn(console, 'log')
    service.success("congrats");
    service.error("mistake");
    service.warn("problem");
    expect(console.log).toHaveBeenCalledWith('Notify Success: congrats');
    expect(console.log).toHaveBeenCalledWith('Notify Error: mistake');
    expect(console.log).toHaveBeenCalledWith('Notify Warn: problem');
  });
});

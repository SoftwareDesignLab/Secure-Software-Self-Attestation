/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
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
import { NotificationsService } from 'angular2-notifications';




@Injectable({
  providedIn: 'root'
})
export class notifyService {

  constructor(private notification: NotificationsService){}

  /**
   * Creates a success notification
   * @param msg message to be displayed
   */
  success(msg: string){
    this.notification.success('Success', msg, {
      timeOut: 5000,
      animate: 'fade',
      pauseOnHover: false
    } );
    console.log("Notify Success: " + msg);

  }
  
  /**
   * Creates a error notification
   * @param msg message to be displayed
   */
  error(msg: string){
    this.notification.error('Error', msg, {
      timeOut: 5000,
      animate: 'fade',
      pauseOnHover: false,
      position: ['bottom', 'left']
    } );
    console.log("Notify Error: " + msg);
  }

  /**
   * Creates a warning notification
   * @param msg messaged to be displayed
   */

  //Currently not used, but might be used for incomplete tasks for generating assesment. 
  warn(msg: string){
    this.notification.warn('Warning', msg, {
      timeOut: 5000,
      animate: 'fade',
      pauseOnHover: false
    } );
    console.log("Notify Warn: " + msg);
  }
}

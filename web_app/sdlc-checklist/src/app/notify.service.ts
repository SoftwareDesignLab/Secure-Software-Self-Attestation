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

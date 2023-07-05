import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';




@Injectable({
  providedIn: 'root'
})
export class notifyService {

  constructor(private notification: NotificationsService){}

  Success(msg: string){
    this.notification.success('Success', msg, {
      position: ['bottom','right'],
      timeOut: 5000,
      animate: 'fade',
    } );
    console.log("Notify Success: " + msg);

  }
  Error(msg: string){
    this.notification.error('Error', msg, {
      position: ['bottom','right'],
      timeOut: 5000,
      animate: 'fade',
    } );
    console.log("Notify Error: " + msg);
  }

  warn(msg: string){
    this.notification.warn('Warning', msg, {
      position: ['bottom','right'],
      timeOut: 5000,
      animate: 'fade',
    } );
    console.log("Notify Warn: " + msg);
  }
}

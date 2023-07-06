import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor() { }
  public companyName: string = "";
  public companyAddress: string = "";
  public city: string = "";
  public state: string = "";
  public postalCode: string = "";
  public country: string = "";
  public website: string = "";

  public firstName: string = "";
  public lastName: string = "";
  public title: string = "";
  public personalAddress: string = "";
  public phone: string = "";
  public email: string = "";


  isFilled(){
    return(
      this.companyName != "" &&
      this.companyAddress != "" &&
      this.city != "" &&
      this.state != "" &&
      this.postalCode != "" &&
      this.country != "" &&
      this.website != "" &&
      this.firstName != "" &&
      this.lastName != "" &&
      this.title != "" &&
      this.personalAddress != "" &&
      this.phone != "" &&
      this.email != ""
    )
  }

}

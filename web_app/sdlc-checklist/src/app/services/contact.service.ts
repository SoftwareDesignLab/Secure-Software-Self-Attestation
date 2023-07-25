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
  public personalCity: string = "";
  public personalState: string = "";
  public personalCountry: string = "";
  public personalPostal: string = "";
  public phone: string = "";
  public email: string = "";



  // Checks if contact form has acceptable amount of info 
  isFilled(){
    return(
      this.companyName !== "" &&
      this.companyAddress !== "" &&
      this.city !== "" &&
      this.state !== "" &&
      this.postalCode !== "" &&
      this.country !== "" &&
      this.website !== "" &&
      this.firstName !== "" &&
      this.lastName !== "" &&
      this.title !== "" &&
      this.personalAddress !== "" &&
      this.personalCity !== "" &&
      this.personalState !== "" &&
      this.personalCountry !== "" &&
      this.phone !== "" &&
      this.email !== ""
    )
  }

  loadIfEmpty(type: string, data: string) {
    if (type === "companyName" && this.companyName === "") {
      this.companyName = data;
    }
    if (type === "companyAddress" && this.companyAddress === "") {
      this.companyAddress = data;
    }
    if (type === "city" && this.city === "") {
      this.city = data;
    }
    if (type === "state" && this.state === "") {
      this.state = data;
    }
    if (type === "country" && this.country === "") {
      this.country = data;
    }
    if (type === "postalCode" && this.postalCode === "") {
      this.postalCode = data;
    }
    if (type === "website" && this.website === "") {
      this.website = data;
    }
    if (type === "firstName" && this.firstName === "") {
      this.firstName = data;
    }
    if (type === "lastName" && this.lastName === "") {
      this.lastName = data;
    }
    if (type === "title" && this.title === "") {
      this.title = data;
    }
    if (type === "personalAddress" && this.personalAddress === "") {
      this.personalAddress = data;
    }
    if (type === "personalCity" && this.personalCity === "") {
      this.personalCity = data;
    }
    if (type === "personalState" && this.personalState === "") {
      this.personalState = data;
    }
    if (type === "personalCountry" && this.personalCountry === "") {
      this.personalCountry = data;
    }
    if (type === "personalPostal" && this.personalPostal === "") {
      this.personalPostal = data;
    }
    if (type === "email" && this.email === "") {
      this.email = data;
    }
    if (type === "phone" && this.phone === "") {
      this.phone = data;
    }
  }
}

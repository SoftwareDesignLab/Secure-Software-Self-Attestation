import { Injectable } from '@angular/core';
import { Metadata, Organization, Person } from '../models/contactModel'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  organization: Organization = new Organization();
  person: Person = new Person();

  /**
   *  Checks if contact form has acceptable amount of info 
   * @returns whether the manditory sections are complete
   */
  isFilled(): boolean{
    return (this.orgName !== "") && (this.orgAddressLine1 !== "") && (this.orgCity !== "") && (this.orgCountry !== "") && (this.orgPostal !== "") &&
           (this.personFirstName !== "") && (this.personAddressLine1 !== "") && (this.personCity !== "") && (this.personCountry !== "") && 
           (this.personPostal !== "") && (this.personEmail !== "") && (this.personPhone !== "");
  }

  get orgName(): string { return this.organization.name;}
  get orgAddressLine1(): string { return this.organization.address.line1; }
  get orgAddressLine2(): string { return this.organization.address.line2; }
  get orgCity(): string { return this.organization.address.city; }
  get orgState(): string { return this.organization.address.state; }
  get orgCountry(): string { return this.organization.address.country; }
  get orgPostal(): string { return this.organization.address.postal; }
  get orgWebsite(): string { return this.organization.website; }
  set orgName(name: string) { this.organization.name = name;}
  set orgAddressLine1(line: string) { this.organization.address.line1 = line; }
  set orgAddressLine2(line: string) { this.organization.address.line2 = line; }
  set orgCity(city: string) { this.organization.address.city = city; }
  set orgState(state: string) { this.organization.address.state = state; }
  set orgCountry(country: string) { this.organization.address.country = country; }
  set orgPostal(postal: string) { this.organization.address.postal = postal; }
  set orgWebsite(website: string) { this.organization.website = website; }

  get personFirstName(): string { return this.person.firstName; }
  get personLastName(): string { return this.person.lastName; }
  get personTitle(): string { return this.person.title; }
  get personAddressLine1(): string { return this.person.address.line1; }
  get personAddressLine2(): string { return this.person.address.line2; }
  get personCity(): string { return this.person.address.city; }
  get personState(): string { return this.person.address.state; }
  get personCountry(): string { return this.person.address.country; }
  get personPostal(): string { return this.person.address.postal; }
  get personEmail(): string { return this.person.email; }
  get personPhone(): string { return this.person.phone; }
  set personFirstName(name: string) { this.person.firstName = name; }
  set personLastName(name: string) { this.person.lastName = name; }
  set personTitle(title: string) { this.person.title = title; }
  set personAddressLine1(line: string) { this.person.address.line1 = line; }
  set personAddressLine2(line: string) { this.person.address.line2 = line; }
  set personCity(city: string) { this.person.address.city = city; }
  set personState(state: string) { this.person.address.state = state; }
  set personCountry(country: string){ this.person.address.country = country; }
  set personPostal(postal: string) { this.person.address.postal = postal; }
  set personEmail(email: string) { this.person.email = email; }
  set personPhone(phone: string) { this.person.phone = phone; }
}

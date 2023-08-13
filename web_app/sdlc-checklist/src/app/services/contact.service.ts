import { Injectable } from '@angular/core';
import { Metadata } from '../models/contactModel'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  metadata: Metadata = new Metadata;

  constructor() {}

  /**
   *  Checks if contact form has acceptable amount of info 
   * @returns whether the manditory sections are complete
   */
  isFilled(): boolean{
    return (this.orgName !== "") && (this.orgAddressLine1 !== "") && (this.orgCity !== "") && (this.orgCountry !== "") && (this.orgPostal !== "") &&
           (this.personFirstName !== "") && (this.personAddressLine1 !== "") && (this.personCity !== "") && (this.personCountry !== "") && 
           (this.personPostal !== "") && (this.personEmail !== "") && (this.personPhone !== "");
  }

  get orgName(): string { return this.metadata.organization.name;}
  get orgAddressLine1(): string { return this.metadata.organization.address.line1; }
  get orgAddressLine2(): string { return this.metadata.organization.address.line2; }
  get orgCity(): string { return this.metadata.organization.address.city; }
  get orgState(): string { return this.metadata.organization.address.state; }
  get orgCountry(): string { return this.metadata.organization.address.country; }
  get orgPostal(): string { return this.metadata.organization.address.postal; }
  get orgWebsite(): string { return this.metadata.organization.website; }
  set orgName(name: string) { this.metadata.organization.name = name;}
  set orgAddressLine1(line: string) { this.metadata.organization.address.line1 = line; }
  set orgAddressLine2(line: string) { this.metadata.organization.address.line2 = line; }
  set orgCity(city: string) { this.metadata.organization.address.city = city; }
  set orgState(state: string) { this.metadata.organization.address.state = state; }
  set orgCountry(country: string) { this.metadata.organization.address.country = country; }
  set orgPostal(postal: string) { this.metadata.organization.address.postal = postal; }
  set orgWebsite(website: string) { this.metadata.organization.website = website; }

  get personFirstName(): string { return this.metadata.person.firstName; }
  get personLastName(): string { return this.metadata.person.lastName; }
  get personTitle(): string { return this.metadata.person.title; }
  get personAddressLine1(): string { return this.metadata.person.address.line1; }
  get personAddressLine2(): string { return this.metadata.person.address.line2; }
  get personCity(): string { return this.metadata.person.address.city; }
  get personState(): string { return this.metadata.person.address.state; }
  get personCountry(): string { return this.metadata.person.address.country; }
  get personPostal(): string { return this.metadata.person.address.postal; }
  get personEmail(): string { return this.metadata.person.email; }
  get personPhone(): string { return this.metadata.person.phone; }
  set personFirstName(name: string) { this.metadata.person.firstName = name; }
  set personLastName(name: string) { this.metadata.person.lastName = name; }
  set personTitle(title: string) { this.metadata.person.title = title; }
  set personAddressLine1(line: string) { this.metadata.person.address.line1 = line; }
  set personAddressLine2(line: string) { this.metadata.person.address.line2 = line; }
  set personCity(city: string) { this.metadata.person.address.city = city; }
  set personState(state: string) { this.metadata.person.address.state = state; }
  set personCountry(country: string){ this.metadata.person.address.country = country; }
  set personPostal(postal: string) { this.metadata.person.address.postal = postal; }
  set personEmail(email: string) { this.metadata.person.email = email; }
  set personPhone(phone: string) { this.metadata.person.phone = phone; }
}

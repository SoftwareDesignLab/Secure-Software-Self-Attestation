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
import { Injectable } from '@angular/core';
import { Organization, Person } from '../models/contactModel'

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

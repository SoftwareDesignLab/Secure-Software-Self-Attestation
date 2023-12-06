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
import { Component } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { AttestationDataService } from '../services/attestation-data.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {


constructor( public contactService: ContactService, private attestationDataService: AttestationDataService ) {}

  /**
   * Updates the stored copies of the contact information
   * @param event The blur event
   * @param item The item that needs to be updated
   */
  update(event: Event, item: string) {
    switch (item) {
      case "orgName": this.contactService.orgName = (event.target as HTMLInputElement).value; break;
      case "orgAddressLine1": this.contactService.orgAddressLine1 = (event.target as HTMLInputElement).value; break;
      case "orgAddressLine2": this.contactService.orgAddressLine2 = (event.target as HTMLInputElement).value; break;
      case "orgCity": this.contactService.orgCity = (event.target as HTMLInputElement).value; break;
      case "orgState": this.contactService.orgState = (event.target as HTMLInputElement).value; break;
      case "orgCountry": this.contactService.orgCountry = (event.target as HTMLInputElement).value; break;
      case "orgPostal": this.contactService.orgPostal = (event.target as HTMLInputElement).value; break;
      case "orgWebsite": this.contactService.orgWebsite = (event.target as HTMLInputElement).value; break;
      case "personFirstName": this.contactService.personFirstName = (event.target as HTMLInputElement).value; break;
      case "personLastName": this.contactService.personLastName = (event.target as HTMLInputElement).value; break;
      case "personTitle": this.contactService.personTitle = (event.target as HTMLInputElement).value; break;
      case "personAddressLine1": this.contactService.personAddressLine1 = (event.target as HTMLInputElement).value; break;
      case "personAddressLine2": this.contactService.personAddressLine2 = (event.target as HTMLInputElement).value; break;
      case "personCity": this.contactService.personCity = (event.target as HTMLInputElement).value; break;
      case "personState": this.contactService.personState = (event.target as HTMLInputElement).value; break;
      case "personCountry": this.contactService.personCountry = (event.target as HTMLInputElement).value; break;
      case "personPostal": this.contactService.personPostal = (event.target as HTMLInputElement).value; break;
      case "personEmail": this.contactService.personEmail = (event.target as HTMLInputElement).value; break;
      case "personPhone": this.contactService.personPhone = (event.target as HTMLInputElement).value; break;
    }
  }

  /**
   * Creates a new form and switches to it
   */
  newForm() {
    this.attestationDataService.createNewForm();
    this.switchToAttestation();
  }

  /**
   * Switches to the attestation form page
   */
  switchToAttestation() {
    if (this.attestationDataService.activeForm === undefined) this.attestationDataService.activeForm = this.attestationDataService.forms[0]
    this.attestationDataService.changePage("attestation-form");
  }

  /**
   * Checks to see if there are any forms loaded
   * @returns Whether there are forms
   */
  areForms(): boolean {
    return this.attestationDataService.forms.length > 0;
  }

}


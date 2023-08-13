import { Component,HostListener  } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Router } from '@angular/router';
import { AttestationDataService } from '../services/attestation-data.service';
import { AssessmentPlanService } from '../services/assessment-plan.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {


constructor( public contactService: ContactService) {}

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

}


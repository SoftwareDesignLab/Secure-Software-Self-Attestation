import { Component } from '@angular/core';
import { ContactService } from '../contact.service';
import { Router } from '@angular/router';
import { AttestationDataService } from '../attestation-data.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {

constructor( public contactService: ContactService, private router: Router,private attestationService: AttestationDataService){

}

  updateCompanyName(event: any){
    this.contactService.companyName = event.target.value;
  }

  updateCompanyAddress1(event: any){
    this.contactService.companyAddress1 = event.target.value;
  }

  updateCompanyAddress2(event: any){
    this.contactService.companyAddress2 = event.target.value;
  }

  updateCity(event: any){
    this.contactService.city=event.target.value;
  }
  updateState(event: any){
    this.contactService.state = event.target.value;
  }
  updatePostal(event: any){
    this.contactService.postalCode= event.target.value;
  }
  updateCountry(event: any){
    this.contactService.country = event.target.value;
  }

  updateWebsite(event: any){
    this.contactService.website = event.target.value;
  }

  updateFirstName(event: any){
    this.contactService.firstName = event.target.value;
  }
  updateLastName(event: any){
    this.contactService.lastName = event.target.value;
  }

  updateTitle(event: any){
    this.contactService.title = event.target.value;
  }
  updatePersonalAddress1(event: any){
    this.contactService.personalAddress1 = event.target.value;
  }
  updatePersonalAddress2(event: any){
    this.contactService.personalAddress2 = event.target.value;
  }
  updatePersonalCity(event: any){
    this.contactService.personalCity = event.target.value;
  }
  
  updatePersonalCountry(event: any){
    this.contactService.personalCountry = event.target.value;
  }

  updatePersonalState(event: any){
    this.contactService.personalState = event.target.value;
  }

  updatePersonalPostal(event: any){
    this.contactService.personalPostal = event.target.value;
  }
  updatePhone(event: any){
    this.contactService.phone = event.target.value;
  }
  updateEmail(event: any){
    this.contactService.email = event.target.value;
  }

  changePage(page: string){
    this.router.navigate([page]);
  }

  isFilled(){
    return !this.contactService.isFilled()
  }

  visitedAttestation(){
    if(this.attestationService.checkVisited()){
      return true
    }
    return false;
  }



}


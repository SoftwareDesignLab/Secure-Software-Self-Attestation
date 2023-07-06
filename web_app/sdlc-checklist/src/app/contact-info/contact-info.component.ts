import { Component } from '@angular/core';
import { ContactService } from '../contact.service';
import { Router } from '@angular/router';
import { attestationComment } from '../attestationForm';
import { AttestationDataService } from '../attestation-data.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {

constructor( public contactService: ContactService, private router: Router,private attestationService: AttestationDataService){

}
  public carlos: string = ''



  
  onKey(event: any) { 
    this.carlos = event.target.value;
    this.contactService.companyName = event.target.value;
  }


  updateCompanyName(event: any){
    this.contactService.companyName = event.target.value;
  }

  updateCompanyAddress(event: any){
    this.contactService.companyAddress = event.target.value;
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
  updatePersonalAddress(event: any){
    this.contactService.personalAddress = event.target.value;
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
    if(this.attestationService.submitable()){
      return true
    }
    return false;
  }


}


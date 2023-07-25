import { Component } from '@angular/core';
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

constructor( public contactService: ContactService, private router: Router,private attestationService: AttestationDataService, private assessmentPlanService: AssessmentPlanService){

}

  updateCompanyName(event: any){
    this.contactService.companyName = event.target.value;
    this.assessmentPlanService.updateProducerInfo({name: event.target.value});
  }

  updateCompanyAddress(event: any){
    this.contactService.companyAddress = event.target.value;
    this.assessmentPlanService.updateProducerInfo({address: event.target.value});
  }

  updateCity(event: any){
    this.contactService.city=event.target.value;
    this.assessmentPlanService.updateProducerInfo({city: event.target.value});
  }
  updateState(event: any){
    this.contactService.state = event.target.value;
    this.assessmentPlanService.updateProducerInfo({state: event.target.value});
  }
  updatePostal(event: any){
    this.contactService.postalCode= event.target.value;
    this.assessmentPlanService.updateProducerInfo({postal: event.target.value});
  }
  updateCountry(event: any){
    this.contactService.country = event.target.value;
    this.assessmentPlanService.updateProducerInfo({country: event.target.value});
  }

  updateWebsite(event: any){
    this.contactService.website = event.target.value;
    this.assessmentPlanService.updateProducerInfo({website: event.target.value});
  }

  updateFirstName(event: any){
    this.contactService.firstName = event.target.value;
    this.assessmentPlanService.updateContactInfo({fname: event.target.value});
  }
  updateLastName(event: any){
    this.contactService.lastName = event.target.value;
    this.assessmentPlanService.updateContactInfo({lname: event.target.value});
  }

  updateTitle(event: any){
    this.contactService.title = event.target.value;
    this.assessmentPlanService.updateContactInfo({title: event.target.value});
  }
  updatePersonalAddress(event: any){
    this.contactService.personalAddress = event.target.value;
    this.assessmentPlanService.updateContactInfo({address: event.target.value});
  }

  updatePersonalCity(event: any){
    this.contactService.personalCity = event.target.value;
    this.assessmentPlanService.updateContactInfo({city: event.target.value});
  }
  
  updatePersonalCountry(event: any){
    this.contactService.personalCountry = event.target.value;
    this.assessmentPlanService.updateContactInfo({country: event.target.value});
  }

  updatePersonalState(event: any){
    this.contactService.personalState = event.target.value;
    this.assessmentPlanService.updateContactInfo({state: event.target.value});
  }

  updatePersonalPostal(event: any){
    this.contactService.personalPostal = event.target.value;
    this.assessmentPlanService.updateContactInfo({postal: event.target.value});
  }
  updatePhone(event: any){
    this.contactService.phone = event.target.value;
    this.assessmentPlanService.updateContactInfo({phone: event.target.value});
  }
  updateEmail(event: any){
    this.contactService.email = event.target.value;
    this.assessmentPlanService.updateContactInfo({email: event.target.value});
  }


  lastAttestation(){
    this.attestationService.updateDynamicForm(this.attestationService.getCurrentForm);
    this.attestationService.refresh();
    this.router.navigate(['attestation-form']);
    }


  changeAttestion(position: number){
    this.attestationService.setView(position);
    this.attestationService.updateDynamicForm(this.attestationService.getCurrentForm);
    this.attestationService.pageName = this.attestationService.getCurrentForm.getName();
    this.attestationService.refresh();
    this.router.navigate(['attestation-form']);
    }


  
  newForm(){
    this.attestationService.addform();
    let newPage = this.attestationService.getdata(this.attestationService.getRawData.length-1).getFormPosition;
    this.changeAttestion(newPage)
  }

  isFilled(){
    return !this.contactService.isFilled()
  }

  checkAttestations(){
    if(this.attestationService.getView>=0){
      return true
    }
    return false;
  }



}


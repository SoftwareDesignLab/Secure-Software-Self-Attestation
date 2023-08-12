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

}


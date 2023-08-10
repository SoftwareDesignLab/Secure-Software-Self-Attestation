import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoComponent } from './contact-info.component';
import { AttestationDataService } from '../services/attestation-data.service';
import { Router } from '@angular/router';


describe('ContactInfoComponent', () => {
  let contact: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;
  let attestationService: AttestationDataService;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactInfoComponent ],
      providers: [ { provide: Router, useValue: mockRouter }]
    })
    .compileComponents();

    attestationService = TestBed.inject(AttestationDataService);
    attestationService.addform();
    attestationService.setView(0);

    fixture = TestBed.createComponent(ContactInfoComponent);
    contact = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(contact).toBeTruthy();
  });

  it('Contact Form not filled', () => {
    expect(contact.isNotFilled()).toEqual(true);
  });

  it('fill out contact and check if filled', () => {

    const mock = {
      target: {
        value: 'anything'
      }
    };
    console.warn(mock.target.value);
    contact.updateCompanyName(mock);
    contact.updateCompanyAddress1(mock);
    contact.updateCompanyAddress2(mock);
    contact.updateCity(mock);
    contact.updateState(mock);
    contact.updatePostal(mock);
    contact.updateCountry(mock);
    contact.updateWebsite(mock);
    contact.updateFirstName(mock);
    contact.updateLastName(mock);
    contact.updateTitle(mock);
    contact.updatePersonalAddress1(mock);
    contact.updatePersonalAddress2(mock);
    contact.updatePersonalCity(mock);
    contact.updatePersonalCountry(mock)
    contact.updatePersonalState(mock);
    contact.updatePersonalPostal(mock);
    contact.updatePhone(mock);
    contact.updateEmail(mock);
    expect(contact.isNotFilled()).toEqual(false);
  });

  it('new Form from contact form', () => {
    contact.newForm();
    let expectedView = attestationService.getRawData.length-1;
    expect(attestationService.getView).toEqual(expectedView);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['attestation-form']);
  });

  it('new Form from contact form', () => {
    const mock1 = {
      key: 'Control',
      value: 'Control'
    };
    const mock2 = {
     key: 'Enter',
     value: 'Control'
    };
    contact.onKeyDown(mock1 as any);
    contact.onKeyDown(mock2 as any);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['attestation-form']);
  });


  

  




});

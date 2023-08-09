import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let contactService: ContactService;


  beforeEach(() => {
    TestBed.configureTestingModule({});
    contactService = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(contactService).toBeTruthy();
  });

  it('fail on empty', () => {
    expect(contactService.isFilled()).toEqual(false);
  });


  it('satisfied when filled out', () => {
    contactService.companyName = "Anything";
    contactService.companyAddress1 = "Anything";
    contactService.city = "Anything";
    contactService.state = "Anything";
    contactService.postalCode = "Anything";
    contactService.country = "Anything";
    contactService.website = "Anything";

    contactService.firstName = "Anything";
    contactService.lastName = "Anything";
    contactService.title = "Anything";
    contactService.personalAddress1 = "Anything";
    contactService.personalCity = "Anything";
    contactService.personalState = "Anything";
    contactService.personalCountry = "Anything";
    contactService.phone = "Anything";
    contactService.email = "Anything";
    expect(contactService.isFilled()).toEqual(true);
  });




});

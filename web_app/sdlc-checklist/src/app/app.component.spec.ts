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
import { ComponentFixture,TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AttestationDataService } from './services/attestation-data.service';
import { combineLatest, generate } from 'rxjs';
import { Router } from '@angular/router';
import { AttestationComponent } from './attestation/attestation.component';
import { ContactService } from './services/contact.service';
describe('AppComponent', () => {

  let attestationService: AttestationDataService;
  let contactService: ContactService;

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let mockRouter = {
    url: '', 
    navigate: jasmine.createSpy('navigate').and.callFake((commands: any[], extras?: any) => {
      mockRouter.url = commands.join('/'); 
    }),
  };




  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SimpleNotificationsModule.forRoot({
          position: ['bottom', 'right']
        })
      ],
      declarations: [
        AppComponent
      ],
      providers: [ 
        { provide: Router, useValue: mockRouter },
      ]

    }).compileComponents();

    attestationService = TestBed.inject(AttestationDataService);
    attestationService.addform();
    attestationService.addform();
    attestationService.setView(0);
    contactService = TestBed.inject(ContactService);

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'catalog-checklist'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('catalog-checklist');
  // });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('catalog-checklist app is running!');
  });

  it('Add form and delete it', () => {
    app.newForm();
    app.deleteForm(attestationService.getView);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['attestation-form']);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['contact-info']);

  });

  it('Delete all forms', () => {
    app.deleteForm(attestationService.getView);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['contact-info']);
  });

  it('toggle nav, nav tree and footer', () => {
    app.toggleNav();
    app.toggleNavTree(0);
    app.toggleNavTree(1);
    app.toggleFooter();
    expect(app.showNav).toEqual(true);
    expect(app.openTag).toEqual(1);
    expect(app.showFullFooter).toEqual(true);
  });


  // Not sure how to stimulate the part that calls findFirstLandingChild with this 
  it('Go to specific location in a Page', () => {
    app.changeAttestation(attestationService.getdata(1), "upload");
    expect(mockRouter.navigate).toHaveBeenCalledWith(['attestation-form'],{fragment: "upload"});

  });


  it('hmtl children recursion', () => {
    const mockEmpty = document.createElement('div');
    const mockParent = document.createElement('div');
    const mockChild = document.createElement('span');
    mockChild.textContent = 'Child';
    mockParent.appendChild(mockChild);

    const mockGrandChild = document.createElement('span');
    mockGrandChild.textContent = 'GrandChild';
    mockGrandChild.classList.add("landing");
    mockChild.appendChild(mockGrandChild);
    expect(app.findFirstLandingChildr(mockParent)?.className).toEqual("landing");
    expect(app.findFirstLandingChildr(mockEmpty)).toEqual(null);

  });


  it('get sublinks of a given attestation component', () => {
  let testList = app.getSubLinks(attestationService.getCurrentForm);
  expect(testList.length).toEqual(3);

  });

  it('all paths for generate report button', () => {
    mockRouter.url = "/contact-info"; 
    
    app.changePage('/contact-info');
    let test1 = app.attestationTypeMissing();

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
    let test2 = app.attestationTypeMissing();

    app.changeAttestation(attestationService.getdata(0));
    let test3 = app.attestationTypeMissing();

    attestationService.getCurrentForm.setAttestationType("multiple");
    attestationService.getCurrentForm.getInfo[0].addName("Fred");
    attestationService.getCurrentForm.getInfo[0].addDate("8/1/2022");
    let test4 = app.invalidContact();

    expect(test1).toEqual(false);
    expect(test2).toEqual(false);
    expect(test3).toEqual(true);
    expect(test4).toEqual(false);
    });





});

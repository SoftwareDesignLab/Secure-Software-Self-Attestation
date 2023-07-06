import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationPageComponent } from './attestation-page.component';

describe('AttestationPageComponent', () => {
  let component: AttestationPageComponent;
  let fixture: ComponentFixture<AttestationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttestationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttestationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

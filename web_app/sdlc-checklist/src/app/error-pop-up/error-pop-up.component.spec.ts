import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPopUpComponent } from './error-pop-up.component';

describe('ErrorPopUpComponent', () => {
  let component: ErrorPopUpComponent;
  let fixture: ComponentFixture<ErrorPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

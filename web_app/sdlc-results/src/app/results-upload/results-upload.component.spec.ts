import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsUploadComponent } from './results-upload.component';

describe('ResultsUploadComponent', () => {
  let component: ResultsUploadComponent;
  let fixture: ComponentFixture<ResultsUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsUploadComponent]
    });
    fixture = TestBed.createComponent(ResultsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

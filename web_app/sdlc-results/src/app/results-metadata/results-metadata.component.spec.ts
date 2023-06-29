import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsMetadataComponent } from './results-metadata.component';

describe('ResultsMetadataComponent', () => {
  let component: ResultsMetadataComponent;
  let fixture: ComponentFixture<ResultsMetadataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsMetadataComponent]
    });
    fixture = TestBed.createComponent(ResultsMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

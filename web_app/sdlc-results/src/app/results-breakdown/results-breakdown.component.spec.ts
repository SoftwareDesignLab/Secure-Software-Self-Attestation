import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsBreakdownComponent } from './results-breakdown.component';

describe('ResultsBreakdownComponent', () => {
  let component: ResultsBreakdownComponent;
  let fixture: ComponentFixture<ResultsBreakdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsBreakdownComponent]
    });
    fixture = TestBed.createComponent(ResultsBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

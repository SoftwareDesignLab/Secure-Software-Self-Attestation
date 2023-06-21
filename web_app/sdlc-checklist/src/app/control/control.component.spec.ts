import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistItemComponent } from './control.component';

describe('ChecklistItemComponent', () => {
  let component: ChecklistItemComponent;
  let fixture: ComponentFixture<ChecklistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

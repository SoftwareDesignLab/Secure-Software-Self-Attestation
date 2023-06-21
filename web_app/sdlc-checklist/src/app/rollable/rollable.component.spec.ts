import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollableComponent } from './rollable.component';

describe('RollableComponent', () => {
  let component: RollableComponent;
  let fixture: ComponentFixture<RollableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

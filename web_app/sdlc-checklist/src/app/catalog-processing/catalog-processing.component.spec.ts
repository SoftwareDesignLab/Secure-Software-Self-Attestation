import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProcessingComponent } from './catalog-processing.component';

describe('CatalogProcessingComponent', () => {
  let component: CatalogProcessingComponent;
  let fixture: ComponentFixture<CatalogProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogProcessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

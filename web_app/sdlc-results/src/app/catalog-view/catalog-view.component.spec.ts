import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogViewComponent } from './catalog-view.component';

describe('CatalogViewComponent', () => {
  let component: CatalogViewComponent;
  let fixture: ComponentFixture<CatalogViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogViewComponent]
    });
    fixture = TestBed.createComponent(CatalogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

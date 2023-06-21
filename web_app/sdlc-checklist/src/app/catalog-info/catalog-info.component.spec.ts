import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogInfoComponent } from './catalog-info.component';

describe('CatalogInfoComponent', () => {
  let component: CatalogInfoComponent;
  let fixture: ComponentFixture<CatalogInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

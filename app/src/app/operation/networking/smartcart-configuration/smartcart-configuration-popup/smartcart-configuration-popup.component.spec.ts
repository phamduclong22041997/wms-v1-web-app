import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartcartConfigurationPopupComponent } from './smartcart-configuration-popup.component';

describe('SmartcartPopupComponent', () => {
  let component: SmartcartConfigurationPopupComponent;
  let fixture: ComponentFixture<SmartcartConfigurationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartcartConfigurationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartcartConfigurationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

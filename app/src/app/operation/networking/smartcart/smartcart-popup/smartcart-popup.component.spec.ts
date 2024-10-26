import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartcartPopupComponent } from './smartcart-popup.component';

describe('SmartcartPopupComponent', () => {
  let component: SmartcartPopupComponent;
  let fixture: ComponentFixture<SmartcartPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartcartPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartcartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

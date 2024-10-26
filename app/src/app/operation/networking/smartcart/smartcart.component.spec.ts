import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartcartComponent } from './smartcart.component';

describe('SmartcartComponent', () => {
  let component: SmartcartComponent;
  let fixture: ComponentFixture<SmartcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

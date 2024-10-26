import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPopupComponent } from './room-popup.component';

describe('RoomPopupComponent', () => {
  let component: RoomPopupComponent;
  let fixture: ComponentFixture<RoomPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlNodeComponent } from './access-control-node.component';

describe('AccessControlNodeComponent', () => {
  let component: AccessControlNodeComponent;
  let fixture: ComponentFixture<AccessControlNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessControlNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

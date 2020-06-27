import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetuserComponent } from './vetuser.component';

describe('VetuserComponent', () => {
  let component: VetuserComponent;
  let fixture: ComponentFixture<VetuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

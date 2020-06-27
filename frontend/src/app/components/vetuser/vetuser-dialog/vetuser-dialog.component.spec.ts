import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VetuserDialogComponent } from './vetuser-dialog.component';

describe('VetuserDialogComponent', () => {
  let component: VetuserDialogComponent;
  let fixture: ComponentFixture<VetuserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VetuserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetuserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

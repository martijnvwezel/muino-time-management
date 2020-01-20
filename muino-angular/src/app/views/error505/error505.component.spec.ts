import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error505Component } from './error505.component';

describe('Error505Component', () => {
  let component: Error505Component;
  let fixture: ComponentFixture<Error505Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error505Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error505Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

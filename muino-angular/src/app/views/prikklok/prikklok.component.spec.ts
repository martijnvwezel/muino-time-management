import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrikklokComponent } from './prikklok.component';

describe('PrikklokComponent', () => {
  let component: PrikklokComponent;
  let fixture: ComponentFixture<PrikklokComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrikklokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrikklokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

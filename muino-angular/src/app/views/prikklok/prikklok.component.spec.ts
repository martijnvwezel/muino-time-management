import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrikklokComponent } from './prikklok.component';

describe('PrikklokComponent', () => {
  let component: PrikklokComponent;
  let fixture: ComponentFixture<PrikklokComponent>;

  beforeEach(async(() => {
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

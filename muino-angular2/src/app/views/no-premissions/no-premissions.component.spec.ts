import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPremissionsComponent } from './no-premissions.component';

describe('NoPremissionsComponent', () => {
  let component: NoPremissionsComponent;
  let fixture: ComponentFixture<NoPremissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPremissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPremissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

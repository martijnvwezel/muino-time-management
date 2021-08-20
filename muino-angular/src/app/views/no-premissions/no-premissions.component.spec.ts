import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoPremissionsComponent } from './no-premissions.component';

describe('NoPremissionsComponent', () => {
  let component: NoPremissionsComponent;
  let fixture: ComponentFixture<NoPremissionsComponent>;

  beforeEach(waitForAsync(() => {
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

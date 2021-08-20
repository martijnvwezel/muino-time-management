import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserIdComponent } from './user-id.component';

describe('UserIdComponent', () => {
  let component: UserIdComponent;
  let fixture: ComponentFixture<UserIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

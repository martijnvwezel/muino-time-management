import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountingComponent } from './accounting.component';

describe('AccountingComponent', () => {
  let component: AccountingComponent;
  let fixture: ComponentFixture<AccountingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

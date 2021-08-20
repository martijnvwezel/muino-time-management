import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TasknewComponent } from './tasknew.component';

describe('TasknewComponent', () => {
  let component: TasknewComponent;
  let fixture: ComponentFixture<TasknewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TasknewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasknewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

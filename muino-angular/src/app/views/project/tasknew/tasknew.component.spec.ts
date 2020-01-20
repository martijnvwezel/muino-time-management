import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasknewComponent } from './tasknew.component';

describe('TasknewComponent', () => {
  let component: TasknewComponent;
  let fixture: ComponentFixture<TasknewComponent>;

  beforeEach(async(() => {
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

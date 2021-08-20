import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectnewComponent } from './projectnew.component';

describe('ProjectnewComponent', () => {
  let component: ProjectnewComponent;
  let fixture: ComponentFixture<ProjectnewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectnewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

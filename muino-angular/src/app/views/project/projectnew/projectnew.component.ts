import { Component, OnInit, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
// import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
// import { NgOption } from '@ng-select/ng-select';

import { ProjectService } from "../project.service";
import { formatDate } from '@angular/common';
//https://github.com/hamzahamidi/angular-forum/blob/1182d17ec4531253cbe8a68d2328c9987a0f8b22/src/app/auth/auth.component.ts
@Component({
  selector: 'app-projectnew',
  templateUrl: './projectnew.component.html',
  styleUrls: ['./projectnew.component.scss']
})
export class ProjectnewComponent implements OnInit {
  public NewProjectForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public error_submit = false;
  public error_string: string;

  public StatusType$ = [
    {
      name: "active",
      description: "Users can write hours to the project."
    }, 
    {
      name:"done",
      description: "Users cannot write hours to the Project"
    }, 
    // {
    //   name: "waiting",
    //   description: "Using this it will be temporaly be not visible to the users."
    // }
  ];

  public assigned$ = [
    { username: ((<any>window).user.username), _id: ((<any>window).user._id) },
  ];


  public statusSelect1: string;
  public assignedSelect1: string[];
  public privateCheckbox1: boolean;



  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private projectService: ProjectService) {


    this.NewProjectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      description: ['', Validators.required],
      project_visibility_level_0: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      project_customer: ['', Validators.required],
    });

  }




  ngOnInit() {
  
    this.assignedSelect1 = [String((<any>window).user._id)];
    this.statusSelect1 = "active";
    
    this.projectService.getPriklokUsers().subscribe(data => (this.assigned$ = data));
  }



  // convenience getter for easy access to form fields
  get f() { return this.NewProjectForm.controls; }


  public NewProject() {


    // var privated = this.project_visibility_level_0 ;
    // console.log(privated);


    this.error_string = "";
    this.loading = true;
    this.submitted = true;

    let formdata = this.NewProjectForm.value;
    formdata.creater_id = (<any>window).user._id;
    console.log(formdata);
    if (formdata.description === "") {
      delete formdata.description
    }


    delete formdata.project_visibility_level_0;

    formdata.private = true;
    if (this.privateCheckbox1) formdata.private = this.privateCheckbox1;
    if (this.statusSelect1) formdata.status = this.statusSelect1;
    if (this.assignedSelect1) formdata.assigned = this.assignedSelect1;
    if (formdata.project_customer === "") delete formdata.project_customer;


    if (formdata.start_date) {
      formdata.time_start = new Date(formdata.start_date).getTime();
    }
    delete formdata.start_date;

    if (formdata.due_date) {
      formdata.time_due = new Date(formdata.due_date).getTime();
    }
    delete formdata.due_date;




    this.projectService.NewProject(formdata).subscribe(data => {
      if (data.error) {
        this.error_submit = true;
        this.error_string += data.error.errmsg;
      } else {
        this.router.navigateByUrl('projects')
      }
    },
      error => {
        this.error_string = error;
        this.submitted = false
      });
    this.loading = false; // rmeote this
    this.submitted = false; // rmeote this
  }


}

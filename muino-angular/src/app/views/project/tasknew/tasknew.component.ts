import { Component, OnInit,OnDestroy,  EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { Location  } from "@angular/common";
import { TaskService } from './task.service';


@Component({
  selector: 'app-tasknew',
  templateUrl: './tasknew.component.html',
  styleUrls: ['./tasknew.component.scss']
})
export class TasknewComponent implements OnInit,OnDestroy {
  public NewTaskForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public error_submit = false;
  public error_string: string;
  public statusSelect2 = "started";
  private id:  string;
  private sub: any;

  public StatusType$ = ["started","stopped"];


  constructor(private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute , 
    private router: Router, 
    private taskService: TaskService,
    private location: Location) {
  
/// parrent effe zetten van het project waar hij net vandaag komt
    this.NewTaskForm = this.formBuilder.group({
      task_name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
    });
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params.id;
      // console.log(params);    

   });
  }

  get f() { return this.NewTaskForm.controls; }



  public NewTask() {

    this.error_string = "";
    this.loading = true;
    this.submitted = true;

    let formdata = this.NewTaskForm.value;
    formdata.creater_id = (<any>window).user._id;
    if(formdata.description===""){
      delete formdata.description
    }
    

    delete formdata.project_visibility_level_0;

    if(formdata.start_date){
      formdata.time_start =  new Date(formdata.start_date).getTime();
    }
    delete formdata.start_date;
    if(formdata.due_date){
      formdata.time_stop = new Date(formdata.due_date).getTime();
    }
    delete formdata.due_date;


    formdata.parrent = this.id ;
    if(this.statusSelect2) formdata.status =  this.statusSelect2;



    console.log("send the data dude", formdata);

    this.taskService.taskNew(formdata).subscribe(data => {
      if (data.error) {
        this.error_submit = true;
        this.error_string += data.error.errmsg;
      } else {
        this.location.back();
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



  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

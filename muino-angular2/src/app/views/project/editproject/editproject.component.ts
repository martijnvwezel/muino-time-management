// TODO project customor
// todo date start date doesnt go well enough 


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectidService } from '../projectid/projectid.service';
import { ProjectService } from "../project.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-editproject',
  templateUrl: './editproject.component.html',
  styleUrls: ['./editproject.component.scss']
})
export class EditprojectComponent implements OnInit {
  public project: any;
  private projectSaved: any;

  public loading = false;

  public statusSelect1: string;
  public assignedSelect1: string[];
  public privateCheckbox1: boolean;

  public error_submit = false;
  public error_string = "Updating project failed!";
  public id: string;
  // public StatusType$ = ["active", "done", "waiting", "stopped"];


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

  public tasks$: any;
  // public project: object;
  public project_name: string;


  constructor(private data: ProjectidService, private dataProject: ProjectService, private route: ActivatedRoute, private router: Router) { }
  
  public convertDate = (_date) => ((new Date(_date)).getFullYear() + "-" + (("0" + ((new Date(_date)).getMonth() + 1)).slice(-2)) + "-" + (("0" + ((new Date(_date)).getDate() + 1)).slice(-2)) );
  
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];// the [+] makes it a number
    });


    this.dataProject.getPriklokUsers().subscribe(data => (this.assigned$ = data));

    this.data.getproject(this.id).subscribe(data => {


      data.time_start = this.convertDate(data.time_start);
      data.time_due = this.convertDate(data.time_due);
      
      this.project = data;
      if (this.project.status) {
        this.statusSelect1 = this.project.status;
      }

      
      if (this.project.assigned) {   
        this.assignedSelect1 = this.project.assigned;
      }

      this.projectSaved = JSON.parse(JSON.stringify(data));// hacky unlink fix
    });

  }

  public update_project() {
    this.error_submit = false;
    this.loading = true;
    let update_needed = false;


    let update_project$ = {
      _id: this.projectSaved._id,
      project_name: this.project.project_name,
      creater_id: this.projectSaved.creater_id
    };

    Object.keys(this.projectSaved).filter(key => {

      if (typeof (this.project[key]) !== "object" && this.project[key] !== this.projectSaved[key] && (this.project[key] != "NaN-aN-aN") ) {
        if (key === "time_start" || key === "time_due") {
          update_project$[key] = (new Date(this.project[key])).getTime();
        } else {
          update_project$[key] = this.project[key];
        }
        update_needed = true;
      }
    });

    if(this.projectSaved.status !==  this.statusSelect1 ){
      update_project$['status'] = this.statusSelect1;
      update_needed = true;
    }


    // TODO  what if value is removed
    console.log(this.project.budget);
    
    if(typeof(this.project.budget) === "number" && (this.projectSaved.budget !==  this.project.budget ) ){
      update_project$['budget'] =  this.project.budget;
      update_needed = true;
    }else if ( this.project.budget === null && this.projectSaved.budget ){ // if the existing value is removed
      update_project$['budget'] =  0;
      update_needed = true;
    }
    // console.log(this.project.budget);
    



    if(this.project.project_customer !== this.projectSaved.project_customer){
      update_project$['project_customer'] =  this.project.project_customer;
      update_needed = true;
    }


    if(this.project.description !== this.projectSaved.description){
      update_project$['description'] =  this.project.description;
      update_needed = true;
    }

    

    if(!this.arraysEqual(this.assignedSelect1, this.projectSaved.assigned)){
      update_project$['assigned'] =  this.assignedSelect1;
      update_needed = true;
    }


    if (update_needed) {
      
      this.data.updateproject({ _id: this.projectSaved._id, data: update_project$ }).subscribe(data => {
        if (data.success) {
          this.project = data;
          this.projectSaved = JSON.parse(JSON.stringify(data));// hacky unlink fixad
          this.error_submit = true;
        }

        if (this.timerbeun) {
          this.loading = false;
          this.timerbeun = false;
          this.router.navigateByUrl('projects/'+this.projectSaved._id);
        } else {
          this.timerbeun = true;
        }

      });
    } else {
      this.timerbeun = true; // when no update needs to be send 
    }

    setTimeout(() => {
      this.disable_loading();
    }, 100);

  }

  private timerbeun = false;
  private disable_loading() {
    // This part is making sure that loading will not stop when it should not stop
    if (this.timerbeun) {
      this.loading = false;
      this.timerbeun = false;
      this.router.navigateByUrl('projects/'+this.projectSaved._id);
    } else {
      this.timerbeun = true;
    }
  }


  private arraysEqual(a, b) {   


    if (a === b) return true;
    // console.log("arrayEqueal is not true possible");
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    //* implement sort when it doesn't matter 
    //* when array is different sorted vs the other
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }





}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.scss']
})
export class EdittaskComponent implements OnInit {

  public loading = false;
  public error_submit = false;
  public error_string = "Updating task failed!";
  public id: string;
  public StatusType$ = ["started", "stopped"];
  public task: any;
  public taskSaved: any;
  public statusSelect1: string;


  public convertDate = (_date) => ((new Date(_date)).getFullYear() + "-" + (("0" + ((new Date(_date)).getMonth() + 1)).slice(-2)) + "-" + (("0" + ((new Date(_date)).getDate())).slice(-2)));

  constructor(private data: ProjectService, private route: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];// the [+] makes it a number
    })


    this.data.getTaskInfo(this.id).subscribe(data => {
    
      this.taskSaved = JSON.parse(JSON.stringify(data));

      
      let temp = data;
      temp.time_start = this.convertDate(temp.time_start);
      temp.time_stop = this.convertDate(temp.time_stop);

      if (temp && temp.status) {
        this.statusSelect1 = temp.status;
      }

      this.task = temp;
      // console.log(this.task);
    });


  }



  public update_task() {

    this.error_submit = false;
    this.loading = true;
    let update_needed = false;


    let update_task$ = {
      _id: this.taskSaved._id,
      task_name: this.task.task_name,
      creater_id: this.taskSaved.creater_id,
      parrent: this.taskSaved.parrent,
    };

    Object.keys(this.task).filter(key => {

      if (typeof (this.task[key]) !== "object" && this.task[key] !== this.taskSaved[key] && (this.task[key] != "NaN-aN-aN")) {
        if (key === "time_start" || key === "time_stop") {
          update_task$[key] = (new Date(this.task[key])).getTime();
        } else {
          update_task$[key] = this.task[key];
        }
        update_needed = true;
      }
    });

    // console.log(this.task.status);
    // console.log(this.taskSaved.status);

    if(this.task.description !== this.taskSaved.description){
      update_needed = true;
    }


    if (this.task.status && (this.task.status !== this.taskSaved.status)) {
      update_task$['status'] = this.task.status;
      update_needed = true;
      // console.log(update_task$);
    }

    // console.log(update_task$);


    if (update_needed) {
      this.data.updatetask(this.taskSaved._id, update_task$).subscribe(data => {
        if (data.success) {
          this.task = data;
          this.taskSaved = JSON.parse(JSON.stringify(data));// hacky unlink fixad
          this.error_submit = true;
        }

        if (this.timerbeun) {
          this.loading = false;
          this.timerbeun = false;
          this.location.back();
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
      this.location.back();
    } else {
      this.timerbeun = true;
    }
  }

}

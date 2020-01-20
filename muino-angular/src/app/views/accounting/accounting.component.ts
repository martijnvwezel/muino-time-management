import { Component, OnInit } from '@angular/core';
import { AccountingService } from "./accounting.service";
import { stringify } from '@angular/compiler/src/util';
import { log } from 'util';


@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {


  public radioModel: string = 'Overview';
  // public radioModel: string = 'Project';
  // public radioModel: string = 'User';
  public year_array: string[] = ['2018', '2019', '2020', '2021', '2022'];
  public thisyear = String(new Date().getFullYear());
  public account_overview: any[];
  public projectSelect1: string = '';
  public projects$: any[];
  public project_week_no$: any[];
  public PROJECT_NAME: string = 'PROJECT';
  public total_hours_task: {};


  // for the total values
  public project_total: Object;
  public user_total: Object;


  public processbalk: String;
  public processbalkcolor: String;

  public weeknumber_search: any[];

  //! new part that should consist of all the data
  private ACCOUNTING$: {
    user_list: [{ hour_rate: number; _id: string }],
    user_assigned_project: []
    success: false
  };

  public ACCOUNTING_USER$: any[];
  public ACCOUNTING_PROJECT$: any[];
  public ACCOUNTING_OVERVIEW$: any[];
  public user_list$ = [];
  public userSelect1: string = "User";



  constructor(private data: AccountingService) {
    this.processbalk = "80%";
    this.processbalkcolor = "bg-danger";
  }

  ngOnInit() {

    this.year_array = [];
    for (let i = Number(this.thisyear) - 1; i < Number(this.thisyear) + 5; i++) {
      this.year_array.push(String(i));
    }

    // this.data.getAccounting(new Date().getTime()).subscribe((data) => {
    //   this.ACCOUNTING$ = data;
    //   this.account_overview = data.user_assigned_project;

    //   this.user_list$ = data.user_list;

    //   if(data.user_list && data.user_list.length > 0 ){
    //     this.userSelect1 = data.user_list[0]._id;
    //   }

    //   this.ACCOUNTING_PROJECT$ = this.convert_to_project_array(data.user_assigned_project);
    
    //   this.ACCOUNTING_USER$ = this.convert_to_user_array(data.user_assigned_project);

    //   this.ACCOUNTING_OVERVIEW$ = this.convert_to_overview_array(data);

    //   console.log(this.ACCOUNTING_PROJECT$);
    //   console.log(this.ACCOUNTING_USER$);
      
    //   this.convert_project_select(data.user_assigned_project);
    //   

    // });
    this.change_year_project(1);
    



    // get week an array filled with 1-->52
    const between_weeks = (k, j) => { var x = []; var i = k; while (x.push(i++) < j) { }; return x }
    this.weeknumber_search = between_weeks(1, 52); //TODO REPLACE TO ________   1, 52 _________
  }



  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public get_user_list() {
    this.ACCOUNTING_USER$ = this.convert_to_user_array(this.ACCOUNTING$.user_assigned_project);
  }


  private convert_to_project_array(accounting_data) {
    let final_array = [];
    let project = accounting_data.find(elem => (elem._id == String(this.projectSelect1)));
    // console.log(this.user_list$);
    let weekTotal = {total: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0, 32: 0, 33: 0, 34: 0, 35: 0, 36: 0, 37: 0, 38: 0, 39: 0, 40: 0, 41: 0, 42: 0, 43: 0, 44: 0, 45: 0, 46: 0, 47: 0, 48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53:0};
    
    if (!project) {// otherwise when no data excist errors occure
      return final_array;
    }

    for (const task of project.sub_tasks) {
      let task_obj = {
        task_name: task.task_name,
        total: 0,
        
      };

      let user_array = [];
      for (const event of task.clock_out_events) {

        if (event.user_id in user_array) {
          user_array[event.user_id][event.week] = event.hours;
          user_array[event.user_id]['total'] += event.hours;
        } else {
          let username = this.user_list$.find(elem => (elem._id == event.user_id)).username;
          let weekno = event.week;
          user_array[event.user_id] = {
            username: username,
            [weekno]: event.hours,
            total: event.hours
          }
        }

        if (!(event.week in task_obj)) {
          task_obj[event.week] = 0;
        }

        task_obj[event.week] += event.hours;
        task_obj['total'] += event.hours;

        weekTotal[event.week] += event.hours; 
        weekTotal.total += event.hours;
      }

      if (task_obj.total != 0) {
        final_array.push(task_obj);
      }

      Object.keys(user_array).forEach(key => {
        final_array.push(user_array[key]);
      });

    }
    this.project_total = weekTotal;

    return final_array;
  }




  // * overview for user overview that also counts the total number of each array
  private convert_to_user_array(accounting_data) {
    // TODO add something that count for the projects

    let weekTotal = {total: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0, 32: 0, 33: 0, 34: 0, 35: 0, 36: 0, 37: 0, 38: 0, 39: 0, 40: 0, 41: 0, 42: 0, 43: 0, 44: 0, 45: 0, 46: 0, 47: 0, 48: 0, 49: 0, 50: 0, 51: 0, 52: 0, 53:0};
    let final_array = [];

    for (const project of accounting_data) {
      let project_obj = {
        project_name: project.project_name,
        total: 0
      };
      let task_array = [];


      for (const task of project.sub_tasks) {

        let task_obj = {
          task_name: task.task_name,
          total: 0
        };

        for (const event of task.clock_out_events) {

          if (this.userSelect1 == event.user_id) {
            task_obj[event.week] = event.hours;
            task_obj['total'] += event.hours;

            if (!(event.week in project_obj)) {
              project_obj[event.week] = 0;
            }
            project_obj[event.week] += event.hours;
            project_obj['total'] += event.hours;

            
            weekTotal[event.week] += event.hours; 
            weekTotal.total += event.hours;
          }
        }

        if (task_obj.total != 0) {
          task_array.push(task_obj);
        }

      }
      if (project_obj.total != 0) {
        final_array.push(project_obj);
      }

      final_array = final_array.concat(task_array);

    }
    this.user_total = weekTotal;
    return final_array;
  };


  

private convert_project_select(data){
  this.projects$ = [];
  data.forEach(elem => {
    this.projects$.push({
      _id: elem._id,
      project_name: elem.project_name
    });
  });
}




  // * overview for user overview that also counts the total number of each array 
  private convert_to_overview_array(accounting_data) {
    // TODO add something that count for the projects


    let final_array = [];

    for (const project of accounting_data.user_assigned_project) {
      let project_obj = {
        project_name: project.project_name,
        status: project.status,
        project_budget: project.budget,
        time_start: this.get_date(project.time_start),
        time_end: this.get_date(project.time_due),
        project_spend: 0,
        hours_total: 0
      };


      for (const task of project.sub_tasks) {
        for (const event of task.clock_out_events) {

          if (!(event.week in project_obj)) {
            project_obj[event.week] = 0;
          }
          project_obj[event.week] += event.hours;
          project_obj['hours_total'] += event.hours;
          project_obj['project_spend'] += event.hours * this.project_user_cost(event.user_id);

        }
      }

      final_array.push(project_obj);

    }
    return final_array;
  };


  private project_user_cost(user_id) {

    for (const elem of this.ACCOUNTING$.user_list) {
      if (elem._id === user_id && elem.hour_rate) {
        return Number(elem.hour_rate);
      }
    }
    // console.log("houre rate not found [project_user_cost], user_id: ", user_id);
    return 0;
  }


  // * set the project name in the header
  public get_projectname_of_id(project_id) {

    for (let i = 0; i < this.projects$.length; i++) {
      if (this.projects$[i]._id == String(project_id)) {
        return this.projects$[i].project_name;
      }
    }
  }





  // * get the total number of hours of a task, but update this incremental 
  public increment_total_hours() {
    this.total_hours_task = {};
    for (const task of this.project_week_no$) {
      let task_name = task.task_name;
      this.total_hours_task[task_name] = 0;

      Object.keys(task.clock_out_events).forEach(key => {

        if (task_name in this.total_hours_task) {
          this.total_hours_task[task_name] += task.clock_out_events[key];
        }
      });
    }



  }


  public get_project_list() {
    // console.log(this.projectSelect1);
    this.PROJECT_NAME = this.get_projectname_of_id(this.projectSelect1);

    this.data.getAccounting_project_info(this.projectSelect1).subscribe(data => {
      this.project_week_no$ = data.sub_tasks;
      this.increment_total_hours();
      // console.log(data);      
    });

  }

  public change_year_project(init) {

    // ! overview, project and users 
    this.data.getAccounting(new Date().setFullYear(Number(this.thisyear))).subscribe((data) => {
      this.ACCOUNTING$ = data;
      this.account_overview = data.user_assigned_project;

      this.user_list$ = data.user_list;
      if (data.user_list.length && data.user_list[0]._id) {
        this.userSelect1 = data.user_list[0]._id;
      } else {
        this.userSelect1 = "";
      }

      this.convert_project_select(data.user_assigned_project);
      if(init){
        this.projectSelect1 = this.projects$[0]._id;
      }
      // * set the data field in the webpage
      this.ACCOUNTING_PROJECT$ = this.convert_to_project_array(data.user_assigned_project);      
      this.ACCOUNTING_USER$ = this.convert_to_user_array(data.user_assigned_project);
      this.ACCOUNTING_OVERVIEW$ = this.convert_to_overview_array(data);
      
    });




    // }

  }
  public get_date(date_) {

    let newdate = new Date(date_).toLocaleString().split(' ')[0].split(',')[0];
    return newdate == 'Invalid' ? '-' : newdate;
  }

  public get_percentage(project_spend, project_budget) {

    if (project_budget == 0) {
      return project_spend == 0 ? "0%" : "100%";
    }
    return (project_spend / project_budget) * 100 + '%';

  }
  public get_warning_color(value) {

    value = Number(value) * 100;

    if (value <= 70) {
      return "bg-success";
    }
    else if (value <= 90) {
      return "bg-warning";
    }

    return "bg-danger";
  }

  public round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    let roundedvalue = Math.round(value * multiplier) / multiplier;
    if (isNaN(roundedvalue)) {
      return 0;
    }
    return roundedvalue;
  }

}

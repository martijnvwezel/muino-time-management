/**
 * TODO fix when task is removed the system cannot find something back anymore 
 * TODO add automaticly a new row
 * TODO Deactivate like the login button the save button
 */


import { Component, OnInit } from '@angular/core';
import { PrikklokService } from "./prikklok.service";
import * as uuid from 'uuid';
import { log } from 'util';


@Component({
  selector: 'app-prikklok',
  templateUrl: './prikklok.component.html',
  styleUrls: ['./prikklok.component.scss']
})
export class PrikklokComponent implements OnInit {

  public yearSelect1 = (new Date()).getFullYear();
  public weekSelect1 = this.getWeek(new Date());
  public weekSelectText = String((new Date()).getFullYear()) + "-W" + String(this.getWeek(new Date()) < 10 ?"0"+this.getWeek(new Date()): this.getWeek(new Date())  );
  public loading = false;
  public active_projects = []; // when a new row is added this list will be added for the projects
public picker;

// test123(){console.log("-> ",this.picker);}


  public data: any[] = []; // * week data  
  private PROJECTS$: any;
  private project_list = []; // * this is used to select new projects
  private ProjectWithSubTasks = [];
  private TaskIDsObject = [];
  private weekdays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
  // private event_list: any[];  // all events so that the id's can be reused
  public week = {
    mo: new Date(),
    tu: new Date(),
    we: new Date(),
    th: new Date(),
    fr: new Date(),
    sa: new Date(),
    su: new Date()
  };

  public counter = { mo: 0, tu: 0, we: 0, th: 0, fr: 0, sa: 0, su: 0, total: 0 };





  constructor(private dataPrikklok: PrikklokService) { }

  ngOnInit() {
    // console.log(this.getWeekProto(new Date()));
    // * set date of each week day  
    this.set_week_dates(new Date());

    // * get projects and tasks
    this.dataPrikklok.getproject().subscribe(data => {
      this.PROJECTS$ = data;
      for (let i in this.PROJECTS$) {
        this.project_list.push(this.PROJECTS$[i].project_name);
        // console.log(this.PROJECTS$[i]); // active_projects

        if(this.PROJECTS$[i].status === "active"){
          this.active_projects.push(this.PROJECTS$[i].project_name);
        }        
      }    

      this.setProjectTaskList(); // * fill list with tasks and project 
      this.get_week_data(); // * where get events is stated
      this.update();
    });

  }


  private get_week_data() {
    // * get events of the choosen week
    this.dataPrikklok.get_events(this.week.mo.getTime(), this.addhoures(this.week.su, 24), (<any>window).user._id).subscribe(data => {
      this.data = this.convert_events_to_week(data);
      // this.event_list = data;
      this.update_table_settings();
    });
  }

/**
 * @brief Make an object with task id   and project to task list \p.
 * @param None
 * @retval None
 */
  private setProjectTaskList() {

    let taskids = [];
    for (let i in this.PROJECTS$) {
      for (let j in this.PROJECTS$[i].sub_tasks) {
        // console.log(this.PROJECTS$[i].sub_tasks[j]);
        if (this.PROJECTS$[i].sub_tasks[j] === null){
          continue;
        }
        let idy = this.PROJECTS$[i].sub_tasks[j]._id;
       
        
        taskids[idy] = {
          project_name: this.PROJECTS$[i].project_name,
          project_id: this.PROJECTS$[i]._id,
          task_name: this.PROJECTS$[i].sub_tasks[j].task_name
        };
      }
    }

    let projectListTasks = [];
    for (let projects of this.PROJECTS$) {
      for (let subTasks of projects.sub_tasks) {
        if (projects.project_name in projectListTasks) {
          projectListTasks[projects.project_name].push(subTasks.task_name);
        }
        else {
          projectListTasks[projects.project_name] = [subTasks.task_name];
        }
      }
    }

    this.TaskIDsObject = taskids;
    this.ProjectWithSubTasks = projectListTasks;
  }

  public update_table_settings() {

    this.counter = { mo: 0, tu: 0, we: 0, th: 0, fr: 0, sa: 0, su: 0, total: 0 };

    for (let idx in this.data) {
      // * adding project lists 
      if (!this.data[idx].project_name) {
        this.data[idx]['project'] = this.project_list;
      }

      // * adding total to the end 
      let total = 0;
      this.weekdays.forEach(element => {
        if (this.data[idx][element]) {
          total = total + this.data[idx][element];
          this.counter[element] += this.data[idx][element];
        }
      });
      this.data[idx].total = total;
      this.counter.total = this.counter.mo + this.counter.tu + this.counter.we + this.counter.th + this.counter.fr + this.counter.sa + this.counter.su;
    }

    this.changeTask();
  }




  private convert_events_to_week(weekData) {

    let temp_week = [];
    let tempGroupid;
    const convTimeString = (time_string) => (new Date(time_string).getTime()); // converting string to time
    const getDay = ({ time_start }) => this.weekdays[(!(new Date(time_start).getDay()) ? (6) : (new Date(time_start).getDay() - 1))]; // For getting the day of the week
    const getHoures = ({ time_start, time_stop }) => ((convTimeString(time_stop) - convTimeString(time_start)) / 3600000); 
    const getProjectList = (projectname) => (!(this.project_list.indexOf(projectname) == -1) ? this.project_list : this.project_list.concat(projectname)); // add projectname in list
    const getTaskList = (taskname, tasklist) => (!(tasklist.indexOf(taskname) == -1) ? tasklist : tasklist.concat(taskname)); // add projectname in list

    temp_week = weekData
      .map(event => ({ ...event, logged: { day: getDay(event), [getDay(event)]: getHoures(event), hours: getHoures(event) } }))
      .reduce((sessions, event) => {
        if (event.groupid in sessions) {
          sessions[event.groupid].events.push(event); // * FIX
          sessions[event.groupid][event.logged.day] = event.logged.hours;
          sessions[event.groupid].comment = event.comment ? event.comment : "";


        } else {
          if (event.groupid) {
            tempGroupid = event.groupid;

          } else {
            tempGroupid = uuid.v4();
            console.warn('groupid doesn\'t excist');
          }

          if (!event.task_id) {
            return sessions;
          }
          sessions[tempGroupid] = {
            comment: event.comment ? event.comment : "",
            [event.logged.day]: event.logged.hours,
            task_id: event.task_id,
            task_name: this.TaskIDsObject[event.task_id].task_name,
            project_id: this.TaskIDsObject[event.task_id].project_id,
            project_name: this.TaskIDsObject[event.task_id].project_name,
            project_list: getProjectList(this.TaskIDsObject[event.task_id].project_name),
            task_list: getTaskList(this.TaskIDsObject[event.task_id].task_name, (this.ProjectWithSubTasks[this.TaskIDsObject[event.task_id].project_name])),
            events: [event]
          }
        }
        return sessions;
      }, []);




    return temp_week;
  }











  private get_task_id(project_name, task_name) {
    // * return task id from a task with project
    for (let project of this.PROJECTS$) {
      if (project.project_name === project_name) {
        for (let task of project.sub_tasks) {
          if (task.task_name == task_name) {
            return task._id;
          }
        }
      }
    }
  }// end task




  public save_week_data() {
    // TODO fix the undefined issue
    this.loading = true;
    const user_id = (<any>window).user._id;
    let create_events_send = [];
    let update_events_send = [];

    const checkTaskID = (element, event) => (element.task_id !== event.task_id);
    const checkComment = (element, event) => ((element.comment) && (element.comment !== event.comment));
    const checkHoures = (element, event, day) => ((element[day] == 0) || element[day] !== event.logged[day]); // * There was an issue with everywhere zero out of nothing.. 
    const checkGroupID = (event) => (!event.groupid)


    Object.keys(this.data).map(key => ({ ...this.data[key], groupid: key }))
      .filter(element => {
        (this.weekdays.map((day) => {
          // if the day is in object and event already excisted
          let sameEvent;
          if (element[day] !== undefined) { // * must be undefined otherwise you cannot remove something with zero

            // sameEvent = element.events.filter(blub => (day in blub.logged))[0];
            if (element.events) {
              element.events.forEach(blub => {
                if (blub.logged && (day in blub.logged)) {
                  sameEvent = blub;
                }
              });
            }


            if (sameEvent && (checkHoures(element, sameEvent, day) || checkComment(element, sameEvent) || checkTaskID(element, sameEvent) || checkGroupID(sameEvent))) {
              // this thould be the update part 
              let tempEvent = {
                time_start: (new Date(sameEvent.time_start)).getTime(),
                time_stop: this.addhoures(sameEvent.time_start, element[day]),
                groupid: element.groupid,
                task_id: this.get_task_id(element.project_name, element.task_name),
                _id: sameEvent._id
              };

              if (element.comment) {
                tempEvent['comment'] = element.comment;
              }

              update_events_send.push(tempEvent);

            } else if (!sameEvent && element[day] !== undefined) { // it is new event
              // * new event
              // console.log({time_start: this.week[day].getTime()});
              // console.log({time_stop: this.addhoures(this.week[day], element[day])});
              
              
              let newEvent = {
                user_id: user_id,
                task_id: element.task_id,//this.get_task_id(element.project_name, element.task_name),
                time_start: this.week[day].getTime(),
                time_stop: this.addhoures(this.week[day], element[day]),
                groupid: element.groupid
              };

              if (element.comment) {
                newEvent['comment'] = element.comment;
              }

              create_events_send.push(newEvent);
            }// else then its the same data in event
          }



        }))
      });




    // console.log("create_events_send:  ", create_events_send);
    // console.log("update_events_send:  ", update_events_send);


    // TODO: write part when error return or saved flag, or just nothing...

    if (create_events_send.length) {
      this.dataPrikklok.event_create_post(create_events_send).subscribe();
    }

    update_events_send.forEach(element => {
      this.dataPrikklok.event_create_put(element).subscribe();
    });

    // if(update_events_send.length > 0 && create_events_send.length > 0){
    // TODO fix this bug
    setTimeout(() => {
      this.update();
    }, 500);

    // }


  }


  public update() {
    this.loading = false;
    let date = this.get_week_date(Number(this.weekSelectText.split("-W")[0]), this.weekSelect1);
    // console.log(new Date(date).toLocaleDateString(),  this.weekSelect1  );
    

    this.set_week_dates(new Date(date));
    this.get_week_data(); // * where get events is stated
    // console.log(this.week);
  } 

  
  

  public set_week(befaft) {
    if (befaft == -1 || befaft == 1) {
      // this.weekSelect1 = this.weekSelect1 + befaft;
      this.weekSelectText = this.set_week_year(Number(this.weekSelectText.split("-W")[0]), Number(this.weekSelectText.split("-W")[1]), befaft);
      this.weekSelect1 = Number(this.weekSelectText.split("-W")[1]);
    } else {
      this.yearSelect1 = Number(this.weekSelectText.split("-W")[0]);
      this.weekSelect1 = Number(this.weekSelectText.split("-W")[1]);
    }
    this.update()
  }

  private set_week_year(year, week, minplus) {
    // helps checking if the date is still valid
    // console.log(year, " -- ", week, " -- ", minplus);
    
    let yearstr = "";
    let weekstr = "";
    if (9 < (week + minplus) && (week + minplus) < 53) {
      yearstr = String(year);
      weekstr = String(week + minplus);
    } else if (0 < (week + minplus) && (week + minplus) < 10) {
      yearstr = String(year);
      weekstr = "0" + String(week + minplus);
    } else if ((week + minplus) < 1) { // * when [week 1]-1=0 so december of year before 
      yearstr = String(year - 1);
      weekstr = String(52);
    } else { // * for new year or old year      
      yearstr = String(year+minplus);
      weekstr = "01";
    }
    // console.log((yearstr + "-W" + weekstr));
    return (yearstr + "-W" + weekstr);
  }


  public changeTaskID() {
    Object.keys(this.data).map(key => ({ ...this.data[key], groupid: key }))
      .map(element => {
        Object.keys(this.TaskIDsObject).map(key => ({ ...this.TaskIDsObject[key], taskid: key })).filter(temp => {
          if (element.project_name == temp.project_name && element.task_name == temp.task_name) {
            // console.log(this.data[element.groupid].task_id);

            this.data[element.groupid].task_id = temp.taskid;
            return;
          }
        });
      });

    // * return task id from a task with project
    //   for (let project of this.PROJECTS$) {
    //     if (project.project_name === project_name) {
    //       for (let task of project.sub_tasks) {
    //         if (task.task_name == task_name) {
    //           return task._id;
    //         }
    //       }

    //   }
    // }// end task

  }

  public changeTask() {

    Object.keys(this.data).map(elem => { this.data[elem].task_list = this.ProjectWithSubTasks[this.data[elem].project_name] });

    /*
    //* update task options
    for (let uuid_ of Object.keys(this.data)) {
      for (let i in this.PROJECTS$) {
        if (this.PROJECTS$[i].project_name == this.data[idx].project_name) {
          this.data[idx].task = [];
          for (let j in this.PROJECTS$[i].sub_tasks) {
            this.data[idx].task.push(this.PROJECTS$[i].sub_tasks[j].task_name);
          }
        }
      }
    }
    */
  }

  /*
  * adding new project row to table
  */
  public add_row() {
    this.data[uuid.v4()] = { project_list: this.active_projects };
  }

  private set_week_dates(date) {
    // * date is set to zero so adding 24 houres is not a problem

    
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.week.mo = new Date(date.setDate(date.getDate() - date.getDay() + 1));// the plus is correction
    this.week.tu = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 1));
    this.week.we = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 2));
    this.week.th = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 3));
    this.week.fr = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 4));
    this.week.sa = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 5));
    this.week.su = new Date(date.setDate(date.getDate() - date.getDay() + 1 + 6));

  }

  private get_week_date(yearno, weekno) {
    // console.log("year: ",  yearno, "   week: ", weekno);
    
    let dag = (weekno-1)*7 + 1; // 7 days for each week
    let monday = new Date(yearno, 0, dag);
    monday = new Date(monday.setDate(monday.getDate() - monday.getDay() + 1));
    // console.log("monday: "+ monday);
    return monday;
    
    // let onejan = new Date(yearno, 0, 1);
    // console.log();
    
    // let day = ((weekno * 7) - 1 ) * 86400000 + Number(onejan); // ! UNKNONW BEHAVIOR REMOVED
    // second -7 is of the day monday
    // console.log(new Date(day).toLocaleDateString(),  weekno  );
    
    // return monday;
  }

  private getWeek(today) {// should bee utc ?  https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    // var onejan = new Date(today.getFullYear(), 0, 1);
    // return Math.ceil((((today - Number(onejan)) / 86400000) + onejan.getDay() + 1) / 7);

    var date = new Date(today.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);

  }





  private addhoures(date_, h) {
    // h = Math.ceil(h)

    if (typeof (date_) === "string") {
      date_ = new Date(date_).getTime();
    }
    else if (typeof (date_) === "object") {
      date_ = date_.getTime();
    }

    // ! temp fix
    if (h < 0) {
      h = h * (-1);
    }

    let with_timeoffset = 0;// new Date(date_).getTimezoneOffset()/-60;


    if (h > 0 && h < 25) { return (date_ + (h * 60 * 60 * 1000)  + with_timeoffset); }
    else if (h > 24) { return (date_ + (h % 24 * 60 * 60 * 1000) + with_timeoffset); }// modulo 24 so there is always something //TODO fix this not dirty
    else if (h == 0) { return date_; }
    else { return date_; }
  }


  public round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    let roundedvalue = Math.round(value * multiplier) / multiplier;
    if(isNaN(roundedvalue) ){
      return 0;
    }
    return roundedvalue;
  }


  /*
  // interface weekrow {
  //   mo: number;
  //   tu: number;
  //   we: number;
  //   th: number;
  //   fr: number;
  //   sa: number;
  //   su: number;
  //   total: number;
  //   comment: string;
  //   project: string[];
  //   task: string[];
  //   projectSel: string;
  //   taskSel: string;
  //   task_id: string;
  //   time_start: number;
  //   time_stop: number;
  //   _id: string;
  // };
  // var isexist = false;
  */

}
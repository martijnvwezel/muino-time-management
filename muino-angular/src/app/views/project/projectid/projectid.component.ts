import { Component, OnInit } from '@angular/core';
// import * as Handsontable from 'handsontable';
import { ActivatedRoute } from '@angular/router';
import { ProjectidService } from './projectid.service';


@Component({
  selector: 'app-projectid',
  templateUrl: './projectid.component.html',
  styleUrls: ['./projectid.component.scss']
})
export class ProjectidComponent implements OnInit {

  constructor(private data: ProjectidService, private route: ActivatedRoute) { }
  public tasks$: any;
  public projects$: any;
  public project_name: string;
  private id: string;
  private sub: any;

  // dtOptions: DataTables.Settings = {};
  public convertDate = (_date) => ((("0" + ((new Date(_date)).getDate())).slice(-2)) + "-" + (("0" + ((new Date(_date)).getMonth() + 1)).slice(-2)) + "-" + (new Date(_date)).getFullYear());


  public convertDated(date) {
    let temp = this.convertDate(date);

    if (temp == "aN-aN-NaN") {
      return "  ";
    }
    return temp;
  }
  ngOnInit() {

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };

    this.route.params.subscribe(params => {
      this.id = params['id'];// the [+] makes it a number
      // console.log(this.id);
    })



    this.data.getproject(this.id).subscribe(data => {
      this.projects$ = data;
      this.tasks$ = data.sub_tasks;
    });

    // this.data.getprojects().subscribe(data => {

    //   // let biertje = data.map(project=>project==this.id));
    //   // this.tasks$ = biertje.sub_tasks;
    //   // this.projects$ = biertje

    //   for (let projects of data) {
    //     if (projects.project_name === this.id) {
    //       this.tasks$ = projects.sub_tasks;
    //       this.projects$ = projects;
    //       // console.log(this.projects$);
    //       break;
    //     }
    //   }


    // });



  }


  public remove_task(_id, task_name) {

    this.data.removeTask(_id, task_name).subscribe(data => console.log(data));
  }


  public fulldate(dateinput) {
    if (!dateinput) {
      return " "
    }

    let temp = new Date(dateinput);
    return String(temp.getDate()) + '-' + String(temp.getMonth() + 1) + '-' + String(temp.getFullYear());
  }

}

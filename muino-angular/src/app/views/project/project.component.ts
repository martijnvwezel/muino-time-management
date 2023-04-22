import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup, UntypedFormControl,
  UntypedFormBuilder, Validators
} from '@angular/forms';
// import * as Handsontable from 'handsontable';
import { ProjectService } from './project.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public projects$: any;
  public usersprikklok$: any[];
  public allprojects$: any[];//admin user only 
  public user: any;
  public showAll: boolean;

  public usersSelect1: string;
  public projectSelect1: string;
  public removecheckbox1 = false;
  public loading = false;
  public dataerrorProject: string;
  public prikklokAdmin = false;

  public year_array: string[] = ['2018', '2019', '2020', '2021', '2022'];
  public thisyear = String(new Date().getFullYear());





  public selectedAreas = [{
    description: "The project of projects cooool",
    project_name: "muino",
    _id: "5ced954c6f6f1e006dbf9565"
  }];

  area = new UntypedFormControl('', [
    Validators.required,
  ]);




  dtOptions: DataTables.Settings = {};
  public convertDate = (_date) => ((("0" + ((new Date(_date)).getDate())).slice(-2)) + "-" + (("0" + ((new Date(_date)).getMonth() + 1)).slice(-2)) + "-" + (new Date(_date)).getFullYear());


  public convertDated(date) {
    let temp = this.convertDate(date);

    if (temp == "aN-aN-NaN") {
      return " -  ";
    }
    return temp;
  }

  // * This part is for change user premissions to users off a project
  public dataerror = " ";

  constructor(private data: ProjectService, private builder: UntypedFormBuilder) { }

  ngOnInit() {
    this.user = (<any>window).user;
    this.prikklokAdmin = this.user.roles.includes('admin');

    // this.dtOptions = { pagingType: 'full_numbers', pageLength: 10, ordering: false }


    // this.data.getprojects().subscribe(data => this.projects$ = data);

    this.data.GetProjectsYear(this.thisyear).subscribe(data => {
      this.projects$ = data;
      // this.selectedAreas = data
    });

    this.data.getPriklokUsers().subscribe(data => this.usersprikklok$ = data); // ! remove


    

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
  }


  // public remove_project(_id, project_name) {
  //   this.data.removeProject(_id, project_name).subscribe(data => console.log(data));
  // }

  // public setProjectpremission() {

  //   this.loading = true;

  //   // this.usersSelect1 = "";
  //   // this.projectSelect1 = "";
  //   // this.removecheckbox1
  //   console.log(this.usersSelect1, this.projectSelect1, this.removecheckbox1);

  //   this.data.updateProjectAssignment(this.usersSelect1, this.projectSelect1, this.removecheckbox1).subscribe();

  //   if (!(this.usersSelect1 && this.projectSelect1)) {
  //     this.dataerrorProject = "Foutje ergens";

  //     setTimeout(() => {
  //       this.dataerrorProject = "";
  //     }, 3000);

  //   }

  //   this.loading = false;
  // }


  // search(query: string) {
  //   // console.log('query', query)
  //   this.data.getALLproject(query).subscribe(data => {
  //     this.allprojects$ = data;
    


  //     if (query === '') {
  //       this.selectedAreas = data;
  //     } else {
  //       this.selectedAreas = this.select(query);
  //       if(this.selectedAreas.length==0){
  //         this.selectedAreas = [{_id:"", project_name: "",description: "" }];
  //       }
  //     }
  //   });

  // }

  // private select(query: string) {
  //   return this.allprojects$.filter(a => (a.project_name.toLowerCase().indexOf(query) > -1));
  // }



  public change_year_project(){

    this.data.GetProjectsYear(this.thisyear).subscribe(data => {
      this.projects$ = data;
      // this.selectedAreas = data
    });
  }


  // public clicky(){
  //   // als je op de zoke balk ram
  //   console.log(this.allprojects$);
    
  // }
}

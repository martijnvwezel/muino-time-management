import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { exist_role, Replace } from "./../../shared/main_functions";
import { BuildNumber } from "../../../buildnumber";
import { UsersService } from './../../views/users/users.service';
import { HeaderService } from "./header.service";
import { HashLocationStrategy } from '@angular/common';
@Component({
  selector: 'app-header_',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [UsersService]
})
export class HeaderComponent implements OnInit {



  public admin_email = "martijnvwezel@muino.nl";
  public image_location = "assets/img/avatars/";
  public users_total = 0;
  public image_foto = "";
  public dashboard_exist = false;
  public BuildNumbernumber = BuildNumber.number;
  public total_users = 0.;

  public active_projects = [];
  public timer_started = false;
  public timer_time = "0:00.00";
  public timer_start_time = (new Date()).getTime();

  // * Selected project part
  public selected_project: string = "";
  public all_project_info: any[];
  public selected_project_tasks: any[];
  public selected_task_name: string = "";




  @Input() user: any = {};

  @Input() fixed: boolean;

  @Input() navbarBrand: any;
  @Input() navbarBrandFull: any;
  @Input() navbarBrandMinimized: any;

  @Input() sidebarToggler: any;
  @Input() mobileSidebarToggler: any;

  @Input() asideMenuToggler: any;
  @Input() mobileAsideMenuToggler: any;


  constructor(
    private authService: AuthService,
    private data: UsersService,
    private router: Router,
    private el: ElementRef,
    private dataPrikklok: HeaderService

  ) { }

  ngOnInit() {



    console.log("Buildnumber: ", this.BuildNumbernumber);




    if (exist_role(this.user, 'dashboard')) {
      this.dashboard_exist = true;
    }

    if (this.user.isAdmin) {
      // this.data.getAllUsers().subscribe(data => this.users_total = data.length);

      this.users_total = this.data.total_size_users;
    }

    if (this.user.avatar_path && this.user.avatar_path.length > 4) {
      this.image_foto = this.image_location + this.user.avatar_path;
    } else {
      this.image_foto = this.image_location + "chicken.jpg";
    }

    if (this.user.company_Path && this.user.company_Path.length > 4) {
      // this.navbarBrand = {src: 'assets/img/brand/sygnet.svg', width: 30, height: 30, alt: 'Muino logo'};
      this.navbarBrandFull = { src: 'assets/img/brand/' + this.user.company_Path, width: 150, height: 50, alt: 'Muino' };
      this.navbarBrandMinimized = { src: 'assets/img/brand/sygnet.svg', width: 50, height: 50, alt: 'Muino' };
    } else {
      // this.navbarBrand = {src: 'assets/img/brand/sygnet.svg', width: 30, height: 30, alt: 'Muino logo'};
      this.navbarBrandFull = { src: 'assets/img/brand/logo.svg', width: 150, height: 50, alt: 'Muino' };
      this.navbarBrandMinimized = { src: 'assets/img/brand/sygnet.svg', width: 50, height: 50, alt: 'Muino' };
    }

    Replace(this.el);
    this.isFixed(this.fixed);




    // * get projects and tasks
    this.dataPrikklok.getproject().subscribe(data => {
      let PROJECTS$ = data;
      this.all_project_info = PROJECTS$;
      // for (let i in PROJECTS$) {
      //   if (PROJECTS$[i].status === "active") {
      //     this.active_projects.push(PROJECTS$[i].project_name);
      //   }
      // }
      this.changeTaskList();
    });






  }



  public changeTaskList() {
    let newlistproject = [];
    let newlistsubtasks = [];
    this.selected_project_tasks = [];

    for (let i in this.all_project_info) {
      if (this.all_project_info[i].status === "active") {
        this.active_projects.push(this.all_project_info[i].project_name);
      }
    }
    if (this.selected_project == "") {
      this.selected_project = this.active_projects[0];
    }
    for (let i in this.all_project_info) {
      if (this.all_project_info[i].project_name === this.selected_project) {
        newlistsubtasks = this.all_project_info[i].sub_tasks;
      }
    }

    this.selected_project_tasks = newlistsubtasks;

    // * if no task has been select use this
    if (this.selected_task_name == "") {
      this.selected_task_name = this.selected_project_tasks[0].task_name;
    }



    console.log(this.selected_project_tasks);




  }

  onclick() { return; }

  logout(): void {
    console.log("logging out...");
    this.authService.signOut();
    this.navigate('/login');
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('header-fixed');
  }
  isFixed(fixed: boolean): void {
    if (this.fixed) { document.querySelector('body').classList.add('header-fixed'); }
  }

  imgSrc(brand: any): void {
    return brand.src ? brand.src : '';
  }

  imgWidth(brand: any): void {
    return brand.width ? brand.width : 'auto';
  }

  imgHeight(brand: any): void {
    return brand.height ? brand.height : 'auto';
  }

  imgAlt(brand: any): void {
    return brand.alt ? brand.alt : '';
  }

  breakpoint(breakpoint: any): void {
    console.log(breakpoint);
    return breakpoint ? breakpoint : '';
  }


  timer_fun(): void {
    this.timer_started = !this.timer_started;

    if (this.timer_started) {
      this.timer_start_time = (new Date()).getTime();
      // * Send to backend that timer is started
      let start_json = {
        selected_project: this.selected_project,
        selected_project_tasks: this.selected_project_tasks,
        timer_start: this.timer_start_time,
      };
      // TODO start endpoint
    } else {
      let start_json = {
        selected_project: this.selected_project,
        selected_project_tasks: this.selected_project_tasks,
        timer_start: this.timer_start_time,
      };
      // TODO add stop endpoint
    }

    interval(1000).subscribe(x => {
      if (this.timer_started) {
        this.update_time(this.timer_start_time);
      }
    });

  }



  update_time(timer_start_time: number, date_now: Date = new Date()): void {
    if (this.timer_started == false) {
      return;
    }
    let delta = date_now.getTime() - timer_start_time;
    let date_new = new Date(delta);
    let hour = (date_new.getHours() < 10 ? '0' : '') + String(date_new.getHours() - 1);
    let minut = (date_new.getMinutes() < 10 ? '0' : '') + String(date_new.getMinutes());
    let sec = date_new.getSeconds();

    this.timer_time = hour + ":" + minut + "." + sec;
  }

}
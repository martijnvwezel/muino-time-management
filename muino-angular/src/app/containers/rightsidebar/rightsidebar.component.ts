import { Component, OnInit , Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exist_role } from "./../../shared/main_functions";

@Component({
  selector: 'app-rightsidebar_',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})
export class RightsidebarComponent implements OnInit {

  @Input() user: any = {};
  public role_exist:boolean;

  public cpu1: String;
  public mem1: String;
  public ssd1: String;
  public hdd1: String;
  
  public status_cpu1: String;
  public status_mem1: String;
  public status_ssd1: String;
  public status_hdd1: String;

  public cpu1color: String;
  public mem1color: String;
  public ssd1color: String;
  public hdd1color: String;

  constructor(private http: HttpClient) {
    this.cpu1 = "0%";
    this.mem1 = "0%";
    this.ssd1 = "0%";
    this.hdd1 = "0%";
  }

  ngOnInit() {
    // this.user = (<any>window).user;

    this.role_exist = false;
    if (this.user && exist_role(this.user, "dashboard")) {
      this.role_exist = true;
      let hostname = "server";
      let count = "1";

      this.http.post('/api/server/getstatus', {
        hostname,
        count
      }).subscribe((data: any) => {

        let data_status = data.go_to_sleep[0];

        if (!data_status) { return; }// if there is just no data

        if (data_status.cpu_load) {
          this.cpu1 = data_status.cpu_load + "%";
          this.status_cpu1 = data_status.cpu_load + "%";
          // var cpu1color_test = "10";
          this.cpu1color = this.get_warning_color(data_status.cpu_load);
          // this.cpu1color = this.get_warning_color(cpu1color_test);

        }
        if (data_status.mem) {
          this.mem1 = data_status.mem.split(" ")[1].replace('(', '').replace(')', '');
          this.status_mem1 = data_status.mem;
          // var mem1color_test = "40";
          this.mem1color = this.get_warning_color(this.mem1.replace('%', ''));
          // this.mem1color = this.get_warning_color(mem1color_test);

        }
        if (data_status.disk) {
          this.ssd1 = data_status.disk.split(" ")[1].replace('(', '').replace(')', '');
          this.status_ssd1 = data_status.disk;
          // var ssd1color_test = "60";
          this.ssd1color = this.get_warning_color(this.ssd1.replace('%', ''));
          // this.ssd1color = this.get_warning_color(ssd1color_test);

        }
        if (data_status.disk2) {
          this.hdd1 = data_status.disk2.split(" ")[1].replace('(', '').replace(')', '');
          this.status_hdd1 = data_status.disk2;
          // var hdd1color_test = "90";
          this.hdd1color = this.get_warning_color(this.hdd1.replace('%', ''));
          // this.hdd1color = this.get_warning_color(hdd1color_test);

        }

      });
    }
  }//nginit

  get_warning_color(value) {
    let color = "";
    if (value > 0 && value <= 30) {
      color = "bg-info";
    }
    else if (value <= 55) {
      color = "bg-success  ";
    }
    else if (value <= 75) {
      color = "bg-warning";
    }
    else if (value <= 100) {
      color = "bg-danger";
    }
    return color;

  }



}

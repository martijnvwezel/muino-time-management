import { Component, OnInit } from '@angular/core';
import { ReportsService } from "./reports.service";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {


  public TemplateType$: string[] = [ "muino-template", "JSON", "XML" ];
  public templateSelect1: string[] = [ this.TemplateType$[0] ];

  public yearSelect1: string[] = [String(new Date().getFullYear())];
  public YearType$: string[] = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']; // auto cleaned in ngOnInit

  public assignedSelect1: string[] = [String((<any>window).user._id)];
  public multiSelectUsers$ = [
    { username: String((<any>window).user.username), _id: String((<any>window).user._id) },
  ];

  public filename: string = " "
  private downloadDate: object[];


  constructor(private data: ReportsService) { }

  ngOnInit() {

    this.YearType$ = [];
    for (let i = Number(this.yearSelect1[0]) - 5; i < Number(this.yearSelect1[0]) + 5; i++) {
      this.YearType$.push(String(i));
    }
    this.generate_filename();

    if ((<any>window).user && ((<any>window).user.roles.indexOf('admin') > -1)) {
      this.data.getPriklokUsers().subscribe(data => (this.multiSelectUsers$ = data));
    }
  }




  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  private generate_filename() {



    let year = String(new Date().getFullYear());
    let month_ = new Date().getMonth() + 1;
    let month = month_ < 10 ? "0" + String(month_) : String(month_);
    let day_ = new Date().getDate();
    let day = day_ < 10 ? "0" + String(day_) : String(day_);
    let hours = String(new Date().getHours());
    let minuts = String(new Date().getMinutes());


    // this.filename = year + month + day + "." + hours + "" + minuts + "-";
    this.filename = year + month + day + "-";

    for (let user of this.assignedSelect1) {
      let founduser = this.multiSelectUsers$.filter(elem => (elem._id == user));
      let username = "";

      if (founduser && founduser.length > 0) {
        // console.log(founduser);

        username = founduser[0].username;
      }

      if (username !== "") {
        this.filename += username + "-";
      }
    }

    for (let year of this.yearSelect1) {
      this.filename += year + "-";
    }

    this.filename += "muino";
  }

  private generate_filename_cust(year_, user_) {

    let year = String(new Date().getFullYear());
    let month_ = new Date().getMonth() + 1;
    let month = month_ < 10 ? "0" + String(month_) : String(month_);
    let day_ = new Date().getDate();
    let day = day_ < 10 ? "0" + String(day_) : String(day_);
    // let hours = String(new Date().getHours());
    // let minuts = String(new Date().getMinutes());


    this.filename = year + month + day + "-";


    let founduser = this.multiSelectUsers$.filter(elem => (elem._id == user_));
    let username = "";

    if (founduser && founduser.length > 0) {
      // console.log(founduser);

      username = founduser[0].username;
    }

    if (username !== "") {
      this.filename += username + "-";
    }


    this.filename += year_ + "-";
    this.filename += "muino";
    return founduser[0];

  }

  private saveTestAsFile(fileText, fileName) {

    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    let fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/csv';
    fileType = fileName.indexOf('.xml') > -1 ? 'text/xml' : fileType;
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(fileText)}`);
    element.setAttribute('download', fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }


  private OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        for (var array in obj[prop]) {
          xml += "<" + prop + ">";
          xml += this.OBJtoXML(new Object(obj[prop][array]));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += this.OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
  }

  public download_reports() {
    // console.log("templateSelect1: ", this.templateSelect1);
    // console.log("yearSelect1: ", this.yearSelect1);
    // console.log("assignedSelect1: ", this.assignedSelect1);





    // TODO arrays return 
    // Fix multi arrray
    // Fix different date return 
    for (const year_ of this.yearSelect1) {
      for (const assigned_ of this.assignedSelect1) {

        let infoObject = {
          year: year_,
          user: this.generate_filename_cust(year_, assigned_).username,
          assigned: this.generate_filename_cust(year_, assigned_)._id,
          template: this.templateSelect1[0],
          filename: this.filename
        };

        this.data.download_excel_files(infoObject).subscribe(data => {
          if (data.length > 0) {

            if ( this.templateSelect1.indexOf('JSON') > -1 ) {
              this.saveTestAsFile(JSON.stringify(data), infoObject.filename + ".json");
            }

            if ( this.templateSelect1.indexOf('XML') > -1 ) {
              let XML = this.OBJtoXML(data)
              this.saveTestAsFile(XML, infoObject.filename + ".xml");
            }
            
            if ( this.templateSelect1.indexOf('muino-template') > -1 ) {
              this.downloadDate = data;
              let converted_users = this.convert_to_weeks(this.downloadDate, this.yearSelect1);
              this.convert_save_to_excel(converted_users, infoObject);
            }
          }

        });

      }
    }

  }








  /**
   * @brief  Convert input data to week data
   * @param input_date the data from dataset that needs to be convert
   * @param year to book of exel
   * @retval array with for each week a 
   */
  private convert_to_weeks(inputData, year) {
    // console.log(inputData);
    // untested when multiple events in same groupweerk
    let year_overview = {};

    // * array with weeknumbers
    for (let i = 1; i < 54; ++i) { //! because week 31 dec can be in the next year week 1  
      year_overview[i] = {};
    }
    const weekdays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

    const get_week_day = (time_start) => weekdays[(!(new Date(time_start).getDay()) ? (6) : (new Date(time_start).getDay() - 1))];

    if (!inputData) {
      // console.log("Error: ", inputData); 
      return;
    }

    inputData.map(elem => {
      let project_name = elem.project_name;

      elem.sub_tasks.map(elemtask => {
        let task_name = elemtask.task_name;

        elemtask.clock_out_events.map(elemeven => {
          // sometimes week 1 is being seen was week 53
          // if(elemeven.week> 52){
          //   elemeven.week = elemeven.week-52;
          // }
          if (year_overview[elemeven.week] && elemeven.groupid in year_overview[elemeven.week]) {
            // * add to object                    
            year_overview[elemeven.week][elemeven.groupid][get_week_day(elemeven.time_stop)] = String(elemeven.hour) + ":" + String(elemeven.minut);
          } else {
            // * make object
          
            
            year_overview[elemeven.week][elemeven.groupid] = {
              project_name,
              task_name,
              mo: '0:0', tu: '0:0', we: '0:0', th: '0:0', fr: '0:0', sa: '0:0', su: '0:0',
              comment: ''
            };

            // * set hour and minuts on correct day
            year_overview[elemeven.week][elemeven.groupid][get_week_day(elemeven.time_stop)] = String(this.round(elemeven.hour, 0) ) + ":" + String(this.round(elemeven.minut, 0));
            year_overview[elemeven.week][elemeven.groupid].comment = elemeven.comment ? elemeven.comment : " ";
          }

        });

      });

    });

    // console.log(year_overview);
    return year_overview;
  }




  /**
   * @brief  Convert to plain csv file
   * @param inputData The data
  //  * @param filename filename to save 
   * @retval file saved with the filename 
   */
  private convert_save_to_excel(inputData, infoObject) {

    if (!inputData) {
      // console.log("Error: ", inputData);      
      return;
    }
    let excelFile = [];

    excelFile.push("years," + infoObject.year + ",,,,,,,\r\n");
    excelFile.push("user," + infoObject.user + ",,,,,\r\n");

    for (let i = 1; i < 53; ++i) {
      // console.log(inputData);
      excelFile.push(",,,,,,,,");
      excelFile.push(",,,,,,,,");
      excelFile.push("week," + String(i) + ",,,,,,,,");
      excelFile.push("Project, Task, mo, tu, we, th, fr, sa, su,comment");


      Object.keys(inputData[i]).forEach(key => {
        let elem = inputData[i][key];
        excelFile.push(elem.project_name + ',' + elem.task_name + ',' + elem.mo + ',' + elem.tu + ',' + elem.we + ',' + elem.th + ',' + elem.fr + ',' + elem.sa + ',' + elem.su + ',' + elem.comment);
      });
    }

    if (this.filename === "") {
      this.filename = "temp";
    }

    this.saveTestAsFile(excelFile.join('\r\n'), infoObject.filename + ".csv");
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

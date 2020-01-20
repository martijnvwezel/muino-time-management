import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { WarningService } from "./warning.service";

@Component({
  // selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = {};
  warnings$: any[];
  constructor(private http: HttpClient, private warning: WarningService) { }

  ngOnInit() {
    this.warning.getWarningData().subscribe((data: any) => {
      $('#DataTables').DataTable().destroy();
      this.warnings$ = data.data;
      this.dtTrigger.next();
      // console.log(data);
    })
  }

}

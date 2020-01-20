import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MatAutocompleteModule, MatDividerModule, MatButtonModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportsService } from "./reports.service";
 
 
 

@NgModule({
  bootstrap: [ 
    ReportsComponent
  ],
  declarations: [ReportsComponent],
  providers:[ReportsService],
  imports: [
    CommonModule,
    BsDropdownModule,
    ButtonsModule,
    ReportsRoutingModule,

    MatAutocompleteModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class ReportsModule { }

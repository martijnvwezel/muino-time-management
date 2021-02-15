import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

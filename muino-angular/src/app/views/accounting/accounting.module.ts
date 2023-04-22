import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AccountingService } from './accounting.service';
import { AccountingComponent } from "./accounting.component";
import { AccountingRoutingModule } from "./accounting-routing.module";



@NgModule({
  declarations: [AccountingComponent],
  providers: [AccountingService],
  imports: [
    FormsModule,
    CommonModule,

    BsDropdownModule,
    ButtonsModule.forRoot(),
    AccountingRoutingModule,
    MatSelectModule,
  ]
})
export class AccountingModule { }

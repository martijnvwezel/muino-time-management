import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

    FormsModule,
    MatAutocompleteModule, MatDividerModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule,
    MatSelectModule
  ]
})
export class AccountingModule { }

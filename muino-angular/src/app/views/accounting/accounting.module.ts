import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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

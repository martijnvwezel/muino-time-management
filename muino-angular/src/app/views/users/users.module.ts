import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { UsersService } from "./users.service";

import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { UserIdComponent } from './user-id/user-id.component';


@NgModule({
  declarations: [UsersComponent, UserIdComponent],
  providers: [UsersService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    DataTablesModule,

    
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
export class UsersModule { }

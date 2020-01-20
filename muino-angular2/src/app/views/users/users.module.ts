import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { UsersService } from "./users.service";

import { MatAutocompleteModule, MatDividerModule, MatButtonModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import {MatSelectModule } from '@angular/material/select';
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

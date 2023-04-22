import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ProjectidComponent } from './projectid/projectid.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectnewComponent } from "./projectnew/projectnew.component";
import { TasknewComponent } from "./tasknew/tasknew.component";
import { EditprojectComponent } from './editproject/editproject.component';
import { EdittaskComponent } from "./edittask/edittask.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';


import {MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';



@NgModule({
  bootstrap: [ 
    ProjectComponent,
    ProjectidComponent,
    ProjectnewComponent,
    TasknewComponent,
    EditprojectComponent,
    EdittaskComponent
  ],
  declarations: [
    ProjectComponent,
    ProjectidComponent,
    ProjectnewComponent,
    TasknewComponent, 
    EditprojectComponent,
    EdittaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,

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
export class ProjectModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MatAutocompleteModule, MatDividerModule, MatButtonModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import {MatSelectModule } from '@angular/material/select';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileService } from "./profile.service";


@NgModule({
  bootstrap: [ 
    ProfileComponent,

  ],
  declarations: [ProfileComponent],
  providers:[ProfileService],
  imports: [
    CommonModule,
    BsDropdownModule,
    ButtonsModule,
    ProfileRoutingModule,

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
export class ProfileModule { }

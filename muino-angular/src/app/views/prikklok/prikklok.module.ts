import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrikklokComponent } from './prikklok.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { PrikklokRoutingModule } from './prikklok-routing.module';
import { MatAutocompleteModule, MatButtonModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule } from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [PrikklokComponent],
  imports: [
    CommonModule,
    FormsModule,
     
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    PrikklokRoutingModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule

  ]
})
export class PrikklokModule { }
  
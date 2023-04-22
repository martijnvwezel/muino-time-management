import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrikklokComponent } from './prikklok.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PrikklokRoutingModule } from './prikklok-routing.module';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [PrikklokComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRippleModule,
    MatInputModule,
    PrikklokRoutingModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule

  ]
})
export class PrikklokModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrikklokComponent } from './prikklok.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { PrikklokRoutingModule } from './prikklok-routing.module';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
  
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// import {
//   MatToolbarModule,
//   MatMenuModule,
//   MatTabsModule,
//   MatDividerModule,
//   MatCardModule,
//   MatListModule,
//   MatExpansionModule,
//   MatButtonModule,
//   MatIconModule,
//   MatDialogModule,
//   MatInputModule,
//   MatSnackBarModule,
//   MatSidenavModule,
//   MatTreeModule,
//   MatProgressBarModule,
//   MatFormFieldModule,
//   MatSelectModule,
// } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatTabsModule,
    MatDividerModule,
    // MatCardModule,
    // MatListModule,
    // MatExpansionModule,
    MatButtonModule,
    // MatIconModule,
    // MatDialogModule,
    MatInputModule,
    // MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    // MatSidenavModule,
    // MatTreeModule,
    // MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexLayoutModule,
  ],
  exports: [
    // MatToolbarModule,
    // MatMenuModule,
    // MatTabsModule,
    MatDividerModule,
    // MatCardModule,
    // MatListModule,
    // MatExpansionModule,
    MatButtonModule,
    // MatIconModule,
    // MatDialogModule,
    MatInputModule,
    // MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    // MatSidenavModule,
    // MatTreeModule,
    // MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexLayoutModule,
  ],
  declarations: [],
})
export class SharedModule { }

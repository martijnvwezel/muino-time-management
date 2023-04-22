import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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

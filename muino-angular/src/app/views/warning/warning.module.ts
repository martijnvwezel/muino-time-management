import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningComponent } from './warning.component';
import { WarningRoutingModule } from './warning-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { WarningService } from "./warning.service";

@NgModule({
  declarations: [WarningComponent],
  providers:[WarningService],
  imports: [
    CommonModule,
    WarningRoutingModule,
    DataTablesModule
  ]
})
export class WarningModule { }

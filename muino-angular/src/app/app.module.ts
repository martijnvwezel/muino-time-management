import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



// special container
import { MaintenanceComponent } from './views/maintenance/maintenance.component';
import { Error404Component } from './views/error404/error404.component';
import { Error505Component } from './views/error505/error505.component';
import { NoPremissionsComponent } from './views/no-premissions/no-premissions.component';
import { LicenseComponent } from './views/license/license.component';
// authentication containers


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHeaderInterceptor } from './auth/interceptors/header.interceptor';
import { CatchErrorInterceptor } from './auth/interceptors/http-error.interceptor';
import { AuthModule } from './auth/auth.module';


// import { AuthComponent } from './auth/auth-routing.module';

// default container
import { DefaultLayoutComponent } from './containers/default-layout.component';
import { HeaderComponent } from './containers/header/header.component';
import { BreadcrumbComponent } from './containers/breadcrumb/breadcrumb.component';
import { SidebarComponent } from './containers/sidebar/sidebar.component';
import { RightsidebarComponent } from './containers/rightsidebar/rightsidebar.component';
import { FooterComponent } from './containers/footer/footer.component';




import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule } from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';



const APP_CONTAINERS = [
  DefaultLayoutComponent,
  HeaderComponent,
  SidebarComponent,
  RightsidebarComponent,
  FooterComponent,
  BreadcrumbComponent
];

// coreui lib
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';


// import {
//   MatAutocompleteModule,
//   MatButtonModule,
//   MatButtonToggleModule,
//   MatCardModule,
//   MatCheckboxModule,
//   MatChipsModule,
//   MatDatepickerModule,
//   MatDialogModule,
//   MatExpansionModule,
//   MatGridListModule,
//   MatIconModule,
//   MatInputModule,
//   MatFormFieldModule,
//   MatListModule,
//   MatMenuModule,
//   MatNativeDateModule,
//   MatPaginatorModule,
//   MatProgressBarModule,
//   MatProgressSpinnerModule,
//   MatRadioModule,
//   MatRippleModule,
//   MatSelectModule,
//   MatSidenavModule,
//   MatSliderModule,
//   MatSlideToggleModule,
//   MatSnackBarModule,
//   MatSortModule,
//   MatStepperModule,
//   MatTableModule,
//   MatTabsModule,
//   MatToolbarModule,
//   MatTooltipModule
// } from '@angular/material';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';



const MATERIAL_CONTAINER_SEL = [
  MatFormFieldModule,
  MatRippleModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
];
/*
const MATERIAL_CONTAINERS = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
];
*/



// Import 3rd party components
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,

    MaintenanceComponent,
    Error404Component,
    Error505Component,
    NoPremissionsComponent,
    LicenseComponent
  ],
  imports: [
    AuthModule,

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ...MATERIAL_CONTAINER_SEL,
    AppRoutingModule // Prefere to be last: https://angular.io/guide/router#module-import-order-matters

  ],
  exports:[...MATERIAL_CONTAINER_SEL],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true,
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: CatchErrorInterceptor,
    multi: true,
  }, SidebarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

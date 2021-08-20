import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';

import { Error404Component } from './views/error404/error404.component';
import { Error505Component } from './views/error505/error505.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
// import { MaintenanceComponent } from './views/maintenance/maintenance.component'
import { NoPremissionsComponent } from './views/no-premissions/no-premissions.component';
import { LicenseComponent } from './views/license/license.component';
import { LogInAsUser, RoleGuardService } from './auth/auth-guard.service';





const routes: Routes = [
  {
    path: '',
    redirectTo: 'prikklok',
    pathMatch: 'full',
  }, {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'error404',
    component: Error404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'error505',
    component: Error505Component,
    data: {
      title: 'Page 505'
    }
  }, {
    path: 'license',
    component: LicenseComponent,
    data: {
      title: 'License'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    data: {
      title: 'Password Reset Page'
    }
  },  
  {
    path: 'password-reset/:id',
    component: PasswordResetComponent,
    data: {
      title: 'Password Reset Page'
    }
  },
  {
    path: 'NoPremissions',
    component: NoPremissionsComponent,
    canActivate: [LogInAsUser],
    data: {
      title: 'No premissions Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [LogInAsUser],
    data: {
      title: "Muino"
    },
    children: [
      {
        path: "users",
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuardService],
        data: { 
          expectedRole: 'admin'
        } 
      },
            {
        path: "profile",
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [LogInAsUser]       
      },
      {
        path: "warning",
        loadChildren: () => import('./views/warning/warning.module').then(m => m.WarningModule),
        canActivate: [RoleGuardService],
        data: { 
          expectedRole: 'admin'
        } 
      },
      {
        path: "projects",
        loadChildren: () => import('./views/project/project.module').then(m => m.ProjectModule),
        canActivate: [RoleGuardService],
        data:{
          expectedRole: 'project'
        }
      },
      {
        path: "accounting",
        loadChildren: () => import('./views/accounting/accounting.module').then(m => m.AccountingModule),
        canActivate: [RoleGuardService],
        data: { 
          expectedRole: 'accounting'
        } 
      },
      {
        path: "reports",
        loadChildren: () => import('./views/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [LogInAsUser]
      },
      {
        path: "prikklok",
        loadChildren: () => import('./views/prikklok/prikklok.module').then(m => m.PrikklokModule),
        canActivate: [LogInAsUser]
      }
    ] 
  }, {
    path: '**',
    component: Error404Component,
    data: {
      title: 'Page 404'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [LogInAsUser, RoleGuardService]
})
export class AppRoutingModule { }


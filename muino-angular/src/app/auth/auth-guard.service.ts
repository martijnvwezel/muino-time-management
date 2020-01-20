import { Injectable } from '@angular/core';
import { CanActivate, Router ,ActivatedRouteSnapshot } from '@angular/router';
import { TokenStorage } from './token.storage';
import { AuthService } from "./auth.service";
import { exist_role } from "../shared/main_functions";

/*

  This service will have no admin can do everything rights so the navbar can build from 
  if the user only had rights to it.

*/

// import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, private token: TokenStorage) { }
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
  
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    
    if (!exist_role(this.token.getInfoExchange(), expectedRole)) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class LogInAsUser implements CanActivate {


  constructor(public router: Router, private token: TokenStorage) { }

  canActivate() {

    const user = (<any>window).user;
    if (user) return true;
    return this.router.navigate(['login']);
  }
}

import { Component, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../auth/auth.service';
import { TokenStorage } from './../../auth/token.storage';
@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  // private userSubscription: Subscription;
  public user: any;
  constructor(private authService: AuthService, private token: TokenStorage) { }

  ngOnInit() {
    var token = this.token.getToken();
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.user = decoded;
      // console.log("user set by token");

    }

    if ((<any>window).user && (<any>window).user.email) {
      this.user = (<any>window).user;
    } else { this.user = { email: "", roles: [] }; }
    // this.userSubscription = this.authService.getUser().subscribe((user) => {
    //   this.user = user;
    //   console.log(user);

    // });
  }

  // ngOnDestroy() {
  //   if (this.userSubscription) {
  //     this.userSubscription.unsubscribe();
  //   }
  // }

}

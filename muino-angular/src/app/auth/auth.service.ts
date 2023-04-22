import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { TokenStorage } from './token.storage';

import { SidebarComponent } from './../containers/sidebar/sidebar.component';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, public router: Router, private token: TokenStorage, private sidebar: SidebarComponent) { }

  public $userSource = new Subject<any>();

  login(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {
        // console.log("data.user"+data.user);
        observer.next({ user: data.user });
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      },
        err => {
          observer.next({ err });
          // console.log(err);

        })
    });
  }

  register(firstname: string, username: string, email: string, password: string, repeatPassword: string): Observable<any> {
    var fullname = firstname;

    return Observable.create(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        firstname,
        username,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        observer.next(data);
        if (data.succes) {
          this.setUser(data.user);
          this.token.saveToken(data.token);
        }
        observer.complete();
      })
    });
  }

  public passwordReset(email: string, password: string, repeatPassword: string, uuid: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/password-reset/' + uuid, {
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      })
    });
  }

  public passwordRstLink(email: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/password-reset', {
        email
      }).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      })
    });
  }





  setUser(user): void {
    if (user) user.isAdmin = (user.roles.indexOf('admin') > -1);
    this.$userSource.next(user);
    (<any>window).user = user;
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable();
  }

  me(): Observable<any> {
    return Observable.create(observer => {
      const tokenVal = this.token.getToken();

      if (!tokenVal) {
        // When token empty no user data request should be made.
        // because he request a new
        console.log("Token not found me()");
        observer.complete();
        return;
      }

      this.setUser(this.token.getInfoExchange()); // get user data from token

      this.http.get('/api/auth/me').subscribe((data: any) => {
        observer.next({ user: data.user });

        this.setUser(data.user);
        this.token.saveToken(data.token);
        return observer.complete();

      }, (error: any) => {
        if (error || error.status === 401) {
          // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
          // console.log(error);
          this.signOut();
          observer.complete();
          return this.router.navigate(['login']);
        }

      });
    });
  }
  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    delete (<any>window).user;
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
// import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';


@Component({
  // selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  //returnUrl: string;
  email: string;
  password: string;
  error_submit= false ;
  error_string: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) {

    // redirect to home if already logged in
    //   if (this.authenticationService.currentUserValue) { 
    //     this.router.navigate(['/']);
    // }
  }




  ngOnInit() {

    
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),//, Validators.email
      password: new FormControl('', [Validators.required])



    });
    this.error_submit = false;
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }



  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }




  login() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) return;

    let password = '';



    password = this.f.password.value;
    var email = this.f.email.value.replace(/\s/g,'');

    if (email!==this.f.email.value) {
      this.error_submit = true;
      this.error_string = "Error: Spaces in Username/Email";
      
      return; // not needed I know 
      
    }

    this.authService.login(email, password)
      .subscribe(
        data => {
          this.router.navigate(['']);
          if (data.err) {
            this.error_submit = true;
            this.error_string = data.err.error;
          }
        }
      );

  }//end login
}// end component

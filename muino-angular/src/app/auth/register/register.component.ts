import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ValidationErrors } from '@angular/forms';


import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  // userForm: FormGroup;
  public loading = false;
  public submitted = false;
  public error_submit = false;
  public error_string: string;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router) {
    // redirect to home if already logged in
    //   if (this.authenticationService.currentUserValue) { 
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {

  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }




  passwordsMatchValidator(control: UntypedFormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new UntypedFormGroup({
    firstName: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new UntypedFormControl('', [Validators.required, this.passwordsMatchValidator])
  })

  // get fullname(): any { return this.userForm.get('fullname'); }
  // get email(): any { return this.userForm.get('email'); }
  // get password(): any { return this.userForm.get('password'); }
  // get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  register() {

    // console.log(this.f.username.value);
    // console.log(this.f.email.value);
    // console.log(this.f.password.value);
    // console.log(this.f.password.value);
    this.submitted = true;
    // stop here if form is invalid
    if (!this.userForm.valid) return;







    // let {
    //   fullname,
    //   email,
    //   password,
    //   repeatPassword
    // } = this.userForm.getRawValue();
    // console.log(this.userForm.getRawValue());

    var email = this.f.email.value.replace(/\s/g, '');
    if (email !== this.f.email.value) {
      this.error_submit = true;
      this.error_string = "Error: Spaces in Email";
      return;
    }
    
    var username = this.f.username.value.replace(/\s/g, '');// error spaces whoehoe
    if (username !== this.f.username.value) {
      this.error_submit = true;
      this.error_string = "Error: Spaces in Username";
      return;

    }


    this.authService.register(this.f.firstName.value, this.f.username.value, this.f.email.value, this.f.password.value, this.f.repeatPassword.value)
      .subscribe(data => {


        if (data.user || data.succes) {
          
          this.error_string ="succes!";
          this.router.navigate(['profile']);
        }
        else {
          this.error_submit = true;
          this.error_string =  data.result.errmsg ;
          // "The " + data.msg.key + " already " ++++++ " -> " + data.msg.keyvalue
        }


      })

  }

}

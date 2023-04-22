import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public error_submit = false;
  public resetLink = false; // password link request or update password link 
  public reseturlid: string;
  public error_string: string;



  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reseturlid = params['id'];// the [+] makes it a number
      if (this.reseturlid || this.reseturlid === "") {
        this.resetLink = true;
      }
      // console.log(this.id);
    })


  }

  public resetForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.minLength(6)]),
    repeatPassword: new UntypedFormControl('', [this.passwordsMatchValidator])
  })


  public passwordsMatchValidator(control: UntypedFormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }


  public passwordReset() {

    this.submitted = true;
    this.loading = true;

    let email = this.f.email.value.replace(/\s/g, '');
    if (email !== this.f.email.value) {
      this.error_submit = true;
      this.error_string = "Error: Spaces in Email";
      return;
    }

    if (!this.reseturlid || this.reseturlid === "") {
      this.passwordRstLink();
    } else {
      this.passwordRst();
    }
    setTimeout(() => {
      this.loading = false;
    }, 500);



  }

  // Requesting the password reset link 
  private passwordRstLink() {
    this.authService.passwordRstLink(this.f.email.value).subscribe(data => {
        if (data.user || data.success) {
          this.router.navigate(['/']);
        } else {
          this.error_submit = true;
          this.error_string = data.msg;
        }
      });
  }

  // Using the password reset link api
  private passwordRst() {
    this.authService.passwordReset(this.f.email.value, this.f.password.value, this.f.repeatPassword.value, this.reseturlid).subscribe(data => {
        if (data.success) {
          this.router.navigate(['/']);
        } else {
          this.error_submit = true;
          this.error_string = data.msg;
        }
      });
  }
}
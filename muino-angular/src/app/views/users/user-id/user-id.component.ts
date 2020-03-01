
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UsersService } from './../users.service';
import { exist_role } from "./../../../shared/main_functions";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-id',
  templateUrl: './user-id.component.html',
  styleUrls: ['./user-id.component.scss']
})
export class UserIdComponent implements OnInit {

  public user = { roles: [], avatar_path: "chicken.jpg" };
  public RoleTypes$: string[] = ["admin", "warning", "project", "accounting", "report"];
  public accountStatus$ = [
    {
      name: "active",
      description: "Full functionalities for the website."
    }, 
    {
      name:"block",
      description: "Let user only have a visable profile page."
    }, 
    {
      name: "onhold",
      description: "Block any login interaction with the server."
    }];
  public rolesSelect: string[];

  public loading = false;
  public submitted = true;
  public updating = true;
  public useridchangeform: string;
  public statusSelect: string;


  public dataerror = " ";
  public dataerror2 = " ";

  // https://www.code-sample.com/2017/10/resize-image-before-upload-javascript.html
  private filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;


  constructor(private router: Router, private data: UsersService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.useridchangeform = params['id'];// the [+] makes it a number
    })
    let user = (<any>window).user;



    this.updating = true;
    this.data.getUserInfo(this.useridchangeform).subscribe(data => (this.set_user_profiel(data)));
    this.updating = false;


  }
  // ! urg
  get f() { return this.userPorfielForm.controls; }


  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userPorfielForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    // firstname: new FormControl('', [Validators.required]),
    // lastname: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    phonenumber: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar_path: new FormControl(''),
    company_Path: new FormControl(''),
    company: new FormControl(''),
    location: new FormControl(''),
    hourrate: new FormControl(''),
    bot_id: new FormControl(''),
    api_token: new FormControl(''),
    chat_id: new FormControl(''),
    password: new FormControl('', [Validators.minLength(6)]),
    repeatPassword: new FormControl('', [this.passwordsMatchValidator])

  })



  private set_user_profiel(element) {

    // TODO moet even hiernaa gaan kijken
    // reset values, set values of user in the form 
    let userprofiel;
    userprofiel = element;


    this.userPorfielForm.reset;
    // console.log(userprofiel);

    if (userprofiel) {
      userprofiel['hourrate'] = userprofiel.hour_rate

      if (userprofiel.telegram && userprofiel.telegram.bot_id) {
        userprofiel['bot_id'] = userprofiel.telegram.bot_id;
      }
      if (userprofiel.telegram && userprofiel.telegram.api_token) {
        userprofiel['api_token'] = userprofiel.telegram.api_token;
      }
      if (userprofiel.telegram && userprofiel.telegram.chat_id) {
        userprofiel['chat_id'] = userprofiel.telegram.chat_id;
      }

      if (userprofiel.avatar_path && userprofiel.avatar_path.length > 4) {
        userprofiel.avatar_path = userprofiel.avatar_path;
      } else {
        userprofiel.avatar_path= "chicken.jpg";
      }

      this.userPorfielForm.patchValue(userprofiel);
      this.statusSelect = userprofiel.acitvity_status;
      this.user = userprofiel;
      this.rolesSelect = userprofiel.roles;
    }

  }


  public submitUserProfiel() {
    this.loading = true;

    if (!this.userPorfielForm || this.userPorfielForm.invalid){ 
      this.loading = false;
      this.dataerror = "Check all inputs again.";
      return;
    }

    // console.log(this.userPorfielForm.value); // ! was this because values didn't change ? 

    this.data.updateUser_v2(this.useridchangeform, this.userPorfielForm.value, this.statusSelect).subscribe(data => { this.dataerror = data.error; });

    this.submit_roles();

    setTimeout(() => {
      this.loading = false;
    }, 500); // * give feeling that something happend

   
  }

  private submit_roles() {

    // * Add role 
    this.rolesSelect.forEach(element => { 
      if (!(this.user.roles.find(e => e === element))) {
        this.data.add_role(this.useridchangeform, element).subscribe(data => (this.set_user_profiel(data[0])));
      }
    });

    // * Remove role 
    this.user.roles.forEach(element => {
      if (!(this.rolesSelect.find(e => e === element))) {
        this.data.remove_role(this.useridchangeform, element).subscribe(data => (this.set_user_profiel(data[0])));
      }
    });

  }

  public remove_user() {
    this.updating = true;
    this.data.remove_user(this.useridchangeform).subscribe(data => {
      this.dataerror = data.error;
      this.dataerror2 = data.error;
      this.updating = false;
    });
  }

  public onSelectFile_bier(event) {
    if (event.target.files && event.target.files[0]) {

      console.log("image size: ", event.target.files[0].size, "    type: ", event.target.files[0].type);

      if (!this.filterType.test(event.target.files[0].type)) {
        alert("Please select a valid image.");
        return;
      }
      var reader2: FileReader = new FileReader();

      if (event.target.files[0].size < 5 * 1024 * 1024 + 1) { // max 5*1024KB
        reader2.readAsDataURL(event.target.files[0]); // read file as data url
      } else {
        let size_ = Math.round(event.target.files[0].size / 1024 / 1024 * 10) / 10;
        let text = "Please select an image size smalller then 1MB. Founded size [" + size_ + " MB]";
        alert(text);
      }
      reader2.onload = (event: Event) => { // called once readAsDataURL is completed
        let base64_image = reader2.result;
        this.data.postProfileAvatar_admin(String(this.useridchangeform), base64_image).subscribe(data => {
          if (data.success) {
            alert("Take a few seconds to be processed. (try relogin otherwise)")
            // this.router.navigate(['/']);
          } else {
            alert("Failed uploading profile picture");
          }
          console.log(data);
        });

        this.user['avatar'] = base64_image;

      }
    }
  }





}

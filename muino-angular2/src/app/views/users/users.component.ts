import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { UsersService } from './users.service';
import { exist_role } from "./../../shared/main_functions";
import { Subscription } from 'rxjs/Subscription';


import { Subject } from 'rxjs';
import { log } from 'util';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public users$: any[];
  // temp. all roles in a list. This needs to be made more robust! (database request?)
  public RoleTypes$ = ["admin", "warning"]; //"active", "block", "onhold",
  public accountStatus$ = ["active", "block", "onhold"];
  public dataerror = " ";
  public dataerror2 = " ";
  public usersSelect1: string;
  public rolesSelect1: string;
  public rolesSelect4: string;
  public useridchangeform: string;
  public removecheckbox1: boolean;
  public loading = false;
  public submitted = false;
  public usersTable = true;
  public updating = true;
  private subscription: Subscription;


  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  public dtTrigger: Subject<any> = new Subject();
  public dtOptions: DataTables.Settings = {};



  public get get_total_users(): number {
    return Object.keys(this.users$).length;
  }


// * newly added 
  public UserSearchRequest: String ;


  constructor(private data: UsersService) {

  }

  public ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // addRolesForm: FormGroup;

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 4
    };


    if (!this.removecheckbox1) {
      this.removecheckbox1 = false;
    }
    let user = (<any>window).user;
    if (exist_role(user, 'admin')) {



      this.data.getAllUsers().subscribe(
        data => {

          data.forEach(element => {
            $('#DataTables').DataTable().destroy();
            // Fix for chrome version: Version 71.0.3578.98 (Official build) (64-bits)
            if(exist_role(element, 'admin')){
              element.isAdmin=true;
            }
            if(element.roles && element.roles.length >0){
              
            }else{
              element.roles_str = element.roles;
            }
            // delete element.roles;
     
          });
          this.updating = true;
          this.users$ = data;
          this.updating = false;
          this.dtOptions = { pagingType: 'full_numbers', pageLength: 4, ordering: false }
          // Calling the DT trigger to manually render the table
          // this.dtTrigger.next();
        }
      );
    }
  }

  public setRole() {
    if (this.users$) {
      this.loading = true;
      for (var i in this.users$) {
        if (this.users$[i]._id === this.usersSelect1) {
          this.data.setRole(this.users$[i].fullname, this.usersSelect1, this.rolesSelect1, this.removecheckbox1).subscribe(
            data_return => {
              $('#DataTables').DataTable().destroy();// clean the datatable when new data is added 
              // TODO $.fn['dataTable'].ext.search.pop();  or this cmd i dont know yet untested 
              // Fix for chrome version: Version 71.0.3578.98 (Official build) (64-bits)
              data_return.forEach(element => {
                element.roles_str = element.roles.toString().split(',').join(' ');
              });

              this.updating = true;
              this.users$ = data_return;
              this.updating = false;
              this.dtOptions = { pagingType: 'full_numbers', pageLength: 4, ordering: false }
              // this.dtTrigger.next();

            }
          );
        }
      }
      // console.log(this.users$);
      this.loading = false;
    }
  }

  get f() { return this.userPorfielForm.controls; }


  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userPorfielForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl(''),
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



  private set_user_profiel(user_id, users) {
    // reset values, set values of user in the form 
    let userprofiel;
    for(let element of users){
      if(element._id===user_id){
        userprofiel = element;
        console.log(element);
        
        break;
      }
      
    }

    this.userPorfielForm.reset;
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
      this.userPorfielForm.patchValue(userprofiel);
      // console.log(userprofiel);
      this.rolesSelect4 = userprofiel.acitvity_status;
    }
  }

  public get_user_info() {
    this.userPorfielForm.reset();
    // console.log(this.useridchangeform);

    this.data.getUserById(this.useridchangeform).subscribe(
      data => this.set_user_profiel(this.useridchangeform, data)
    );
  }


  public submitUserProfiel() {
    this.loading = true;
    this.submitted = true;
    if (!this.userPorfielForm) return;


    this.data.updateUser(
      this.useridchangeform,
      this.f.firstname.value,
      this.f.lastname.value,
      this.f.username.value,
      this.f.phonenumber.value,
      this.f.email.value,
      this.f.avatar_path.value,
      this.f.company_Path.value,
      this.f.company.value,
      this.f.location.value,
      this.f.hourrate.value,
      this.f.bot_id.value,
      this.f.api_token.value,
      this.f.chat_id.value,
      this.f.password.value,
      this.f.repeatPassword.value,
      this.rolesSelect4).subscribe(data => {
        // console.log(data.error);
        this.dataerror = data.error;

        // this.subscription = this.timer.subscribe(() => {
        //     // set showloader to false to hide loading div from view after 5 seconds
        // this.dataerror = "";
        // });
      }
      );

    this.loading = false;
    return;
  }

  public remove_user(user_id) {

    console.log(user_id);

    this.data.remove_user(
      user_id
    ).subscribe(data => {
      // console.log(data.error);
      this.dataerror = data.error;
      this.updating = true;
      this.users$ = data.users.reverse();// alle user
      this.updating = false;
      this.dtOptions = { pagingType: 'full_numbers', pageLength: 4, ordering: false }
      this.dataerror2 = data.error;

    }
    );


  }


// * show a  nice readable string for the user
  public clean_date(createdAt){
    return new Date(createdAt).toDateString();
  
  }


}
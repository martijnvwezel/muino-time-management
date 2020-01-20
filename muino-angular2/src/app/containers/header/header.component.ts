import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
// import { Observable } from 'rxjs';
import { exist_role, Replace } from "./../../shared/main_functions";
import { BuildNumber } from "../../../buildnumber";
import { UsersService } from './../../views/users/users.service';

@Component({
  selector: 'app-header_',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [UsersService]
})
export class HeaderComponent implements OnInit {



  public admin_email = "martijnvwezel@muino.nl";
  public image_location = "assets/img/avatars/";
  public users_total = 0;
  public image_foto = "";
  public dashboard_exist = false;
  public BuildNumbernumber = BuildNumber.number;
  public total_users = 0.;

  @Input() user: any = {};

  @Input() fixed: boolean;

  @Input() navbarBrand: any;
  @Input() navbarBrandFull: any;
  @Input() navbarBrandMinimized: any;

  @Input() sidebarToggler: any;
  @Input() mobileSidebarToggler: any;

  @Input() asideMenuToggler: any;
  @Input() mobileAsideMenuToggler: any;


  constructor(
    private authService: AuthService,
    private data: UsersService,
    private router: Router,
    private el: ElementRef

  ) { }

  ngOnInit() {


    console.log("Buildnumber: ", this.BuildNumbernumber);


  

    if (exist_role(this.user, 'dashboard')) {
      this.dashboard_exist = true;
    }

    if (this.user.isAdmin) {
      // this.data.getAllUsers().subscribe(data => this.users_total = data.length);

      this.users_total = this.data.total_size_users;
    } 

    if (this.user.avatar_path && this.user.avatar_path.length > 4) {
      this.image_foto = this.image_location + this.user.avatar_path;
    } else {
      this.image_foto = this.image_location + "chicken.jpg";
    }

    if (this.user.company_Path && this.user.company_Path.length > 4) {
      // this.navbarBrand = {src: 'assets/img/brand/sygnet.svg', width: 30, height: 30, alt: 'Muino logo'};  
      this.navbarBrandFull = { src: 'assets/img/brand/' + this.user.company_Path, width: 150, height: 50, alt: 'Muino' };
      this.navbarBrandMinimized = { src: 'assets/img/brand/sygnet.svg', width: 50, height: 50, alt: 'Muino' };
    } else {
      // this.navbarBrand = {src: 'assets/img/brand/sygnet.svg', width: 30, height: 30, alt: 'Muino logo'};  
      this.navbarBrandFull = { src: 'assets/img/brand/logo.svg', width: 150, height: 50, alt: 'Muino' };
      this.navbarBrandMinimized = { src: 'assets/img/brand/sygnet.svg', width: 50, height: 50, alt: 'Muino' };
    }

    Replace(this.el);
    this.isFixed(this.fixed);

  }

  onclick() { return; }

  logout(): void {
    console.log("logging out...");
    this.authService.signOut();
    this.navigate('/login');
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('header-fixed');
  }
  isFixed(fixed: boolean): void {
    if (this.fixed) { document.querySelector('body').classList.add('header-fixed'); }
  }

  imgSrc(brand: any): void {
    return brand.src ? brand.src : '';
  }

  imgWidth(brand: any): void {
    return brand.width ? brand.width : 'auto';
  }

  imgHeight(brand: any): void {
    return brand.height ? brand.height : 'auto';
  }

  imgAlt(brand: any): void {
    return brand.alt ? brand.alt : '';
  }

  breakpoint(breakpoint: any): void {
    console.log(breakpoint);
    return breakpoint ? breakpoint : '';
  }

}
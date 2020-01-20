import { Component, OnInit, Input } from '@angular/core';
import { SidebarComponent } from '../../containers/sidebar/sidebar.component';
import { ProfileService } from "./profile.service";

import { Router } from '@angular/router';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // public user: any;
  @Input() user: any = {};

  private user_null = { "user": { roles: [""], "fullname": "", "firstname": "", "username": "", "email": "", "acitvity_status": "", "createdAt": "", "company": "", "company_Path": "", "lastname": "", "phonenumber": "" } }
  // https://www.code-sample.com/2017/10/resize-image-before-upload-javascript.html
  private filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

  constructor(private router: Router, private sidebar: SidebarComponent, private profileService: ProfileService) { }

  ngOnInit() {

    this.user = (<any>window).user;

    if (!this.user) {
      console.log("user not found");
      this.user = this.user_null;
    }

    if (this.user.avatar_path && this.user.avatar_path.length > 4) {
      this.user.avatar_path = this.user.avatar_path;
    } else {
      this.user.avatar_path = "chicken.jpg";
    }


  }


  public onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {

      // console.log("image size: ", event.target.files[0].size, "    type: ", event.target.files[0].type);


      if (!this.filterType.test(event.target.files[0].type)) {
        alert("Please select a valid image.");
        return;
      }
      var reader: FileReader = new FileReader();

      if (event.target.files[0].size < 5 * 1024 * 1024 + 1) { // max 5*1024KB
        reader.readAsDataURL(event.target.files[0]); // read file as data url
      } else {
        let size_ = Math.round(event.target.files[0].size / 1024 / 1024 * 10) / 10;
        let text = "Please select an image size smalller then 1MB. Founded size [" + size_ + " MB]";
        alert(text);
      }
      reader.onload = (event: Event) => { // called once readAsDataURL is completed
        let base64_image = reader.result;
        this.profileService.postProfileAvatar(base64_image).subscribe(data => {
          if (data.success) {
            alert("Take a few seconds to be processed. (try relogin otherwise)")
            this.router.navigate(['/']);
          }else{
            alert("Failed uploading profile picture");
          } console.log(data);
        });

        this.user.avatar = base64_image;

      }
    }
  }
  public delete() {
    this.user.avatar = null;
  }

}



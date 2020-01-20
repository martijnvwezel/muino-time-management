import { Component,HostBinding,  OnInit, Input  } from '@angular/core';
import { navItems } from "./../../_nav";


@Component({
  selector: 'app-sidebar_',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit{
  public navItems = navItems;
  // @Input() navItems : Array<any>;
  @HostBinding('class.sidebar-nav') true;
  @HostBinding('attr.role') role;




  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public avatar_path = "assets/img/avatars/chicken.jpg";
  
  public enableSideBar = true;

  @Input() user: any ;

  constructor() {
    // this.renderer.addClass(document.body, 'sidebar-minimized'); private renderer: Renderer2
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
      // console.log(this.sidebarMinimized);
      

    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });


  }
  
  public toggleMenu(){
//         // this.enableSideBar =!this.enableSideBar;
//         document.body.classList.contains('sidebar-minimized') ?
//             this.renderer.removeClass( document.body, 'sidebar-minimized') :
//             this.renderer.addClass( document.body, 'sidebar-minimized');
        this.sidebarMinimized = !this.sidebarMinimized;
      }

  ngOnInit() {
  
  }




  sidebarM() {
    this.sidebarMinimized = !this.sidebarMinimized;

  }
  clearSidebar(){}

  public addtosidebar(add_navitem) {
    // Check if element already excists
    // this.navItems = add_navitem;
    this.enableSideBar = false;
    for (let navElem of add_navitem) {
      for(let element of this.navItems){
        if (element===navElem){
          return;
        }
      }
      // this.navItems.push.apply(this.navItems,navElem);
      this.navItems.push(navElem);
    }

    // console.log(this.navItems);
    
    this.enableSideBar = true;
  }

  isDivider(navItem) {
    return !!navItem.divider
}

isTitle(navItem) {
    return !!navItem.title
}

isHasChild(navItem) {
    return navItem.hasOwnProperty('children') && navItem.children.length > 0;
}

  

}

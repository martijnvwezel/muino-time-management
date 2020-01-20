//https://github.com/coreui/coreui-angular/blob/master/projects/coreui/angular/src/lib/shared/replace.ts
export function exist_role(user, check_role){

     if(!user || !user.roles) return false;

    for(let role of user.roles){
      if(role === check_role){
        return true;
      }
    }
    return false;     
  }

  export function  Replace(el: any): any {
    const nativeElement: HTMLElement = el.nativeElement;
    const parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    // remove the empty element(the host)
    parentElement.removeChild(nativeElement);
  }

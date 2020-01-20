import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) { }//, private token: TokenStorage

    postProfileAvatar(image): Observable<any> {
        console.log("upload to server\n");
        return Observable.create(observer => {
            this.http.post('/api/user/avatar', {
                image                
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }


}
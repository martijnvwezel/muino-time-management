import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({ // needed
    providedIn: 'root'
})
export class HeaderService {

    constructor(private http: HttpClient) { }
    public getproject(): Observable<any> {
        return Observable.create(observer => {
            // get only active projects
            this.http.get('/api/prikklok/project').subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }
}
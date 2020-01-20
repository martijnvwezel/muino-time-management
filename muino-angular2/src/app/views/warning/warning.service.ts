import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class WarningService {

    constructor(private http: HttpClient) { }//, private token: TokenStorage

    getWarningData(): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/warning/getwarning', {
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }


}
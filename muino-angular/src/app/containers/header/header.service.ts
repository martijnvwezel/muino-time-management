import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable({ // needed
    providedIn: 'root'
})
export class HeaderService {
    public timer_time = "0:00.00";


    constructor(private http: HttpClient) { }
    public getproject(): Observable<any> {
        return new Observable((observer: Observer<object>) => {
            // get only active projects
            this.http.get('/api/prikklok/project').subscribe((data: any) => {
                observer.next(data);
                console.log(data);

                observer.complete();
            })
        });
    }

    public increaseNumber(timer_value: string) {
        this.timer_time = timer_value;
        // this.timer_time_subject.next(this.timer_time);
      }
}
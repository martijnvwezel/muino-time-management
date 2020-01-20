import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(private http: HttpClient) { }

    

    taskNew(taskNew): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/prikklok/task',
                taskNew

            ).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

 


}
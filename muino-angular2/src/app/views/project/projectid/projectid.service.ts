import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ProjectidService {

    constructor(private http: HttpClient) { }

    getprojects(): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/projects', {
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    getproject(project_id: string): Observable<any> {
        
        return Observable.create(observer => {
            this.http.get('/api/prikklok/project/'+project_id).subscribe((data: any) => {
                observer.next(data[0]);
                observer.complete();
            })
        });
    }



    removeTask(_id: string, task_name: string): Observable<any> {
        console.log(_id, task_name);

        return Observable.create(observer => {
            this.http.delete('/api/prikklok/task/' + _id

            ).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }
    
    updateproject({ _id, data }: { _id: string; data: object; }): Observable<any> {
        return Observable.create(observer => {
            this.http.put('/api/prikklok/project/'+_id,data).subscribe((data: any) => {
                if(!data.success)
                    observer.next({success: false});
                else
                    observer.next(data.updated_project);
                observer.complete();
            })
        });
    }






}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(private http: HttpClient) { }

    getprojects(): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/projects').subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }
/*
    getALLproject(): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/projects_admin').subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

*/
    
    // getALLproject(searchTerm: string): Observable<any> {
    //     return Observable.create(observer => {
    //         this.http.post('/api/prikklok/project/search',{searchTerm}).subscribe((data: any) => { 
    //             observer.next(data.project_list);
    //             observer.complete();
    //         })
    //     });
    // }

    

    GetProjectsYear(year): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/projects/'+String(year)).subscribe((data: any) => {                
                if(data.success){
                    observer.next(data.projects);
                }else{
                    observer.next([]);
                }
                observer.complete();
            })
        });
    }


    

    NewProject(NewProject): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/prikklok/project',
                NewProject
            ).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    removeProject(_id: string, project_name: string): Observable<any> {
        // console.log(_id, project_name);

        return Observable.create(observer => {
            this.http.delete('/api/prikklok/project/' + _id

            ).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }


    updatetask(_id: string, data: object): Observable<any> {
        return Observable.create(observer => {
            this.http.put('/api/prikklok/task/' + _id, data).subscribe((data: any) => {
                if (!data.success)
                    observer.next({ success: false });
                else
                    observer.next(data.updated_project);
                    
                observer.complete();
            })
        });
    }

    getPriklokUsers(): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/users').subscribe((data: any) => {
                if(data.success){
                    observer.next(data.user_list);
                }else{
                    observer.next([]);
                }
                observer.complete();
            })
        });
    }

    // this.usersSelect1, this.projectSelect1, this.removecheckbox1
    updateProjectAssignment(user_id: string, project_id: string ,removecheckbox: boolean): Observable<any> {
        return Observable.create(observer => {
            this.http.put('/api/prikklok/project/premissions',{
                user_id,
                project_id,
                removecheckbox
            }).subscribe((data: any) => {
                if (!data.success)
                    observer.next({ success: false });
                else
                    observer.next(data.updated_project);
                    
                observer.complete();
            })
        });
    }



    getTaskInfo(_id:string): Observable<any> {
        return Observable.create(observer => {
            this.http.get('/api/prikklok/task/'+String(_id)).subscribe((data: any) => {
                if(data.success){
                    observer.next(data.taskDetails);
                }else{
                    observer.next({});
                }
                observer.complete();
            })
        });
    }


}
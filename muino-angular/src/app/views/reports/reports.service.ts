import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ReportsService {

    constructor(private http: HttpClient) { }//, private token: TokenStorage


    public getPriklokUsers(): Observable<any> {
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

    public download_excel_files(infoObject): Observable<any> {
        // template: string[], years: string[], assigned: string[]
        return Observable.create(observer => {
            this.http.post('/api/prikklok/report',{
                template: [infoObject.template],
                years: [infoObject.year],
                assigned: [infoObject.assigned]
            }).subscribe((data: any) => {
                if(data.success){
                    observer.next(data.user_assigned_project);                  
                }else{
                    observer.next([]);
                }
                observer.complete();
            })
        });
    }


}
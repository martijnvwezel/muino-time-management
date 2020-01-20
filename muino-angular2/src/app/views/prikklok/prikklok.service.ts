import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({ // needed
  providedIn: 'root'
})
export class PrikklokService {

    constructor(private http: HttpClient) { }


    /*  
    * y_no: year number like 2018 or 2019
    * w_no: week number of the year you want to look
    * u_no: which user you want the data from, should make some role based system for this
    */
    public get_events_(y_no, w_no, u_no) {
        return {
            user_name: u_no,
            year_no: y_no,
            week_no: w_no,
            week_data: [
                {
                    su: 1,
                    mo: 2,
                    tu: 3,
                    we: 4,
                    th: 5,
                    fr: 6,
                    sa: 7,
                    total: 22,
                    comment: "changes",
                    project:  ['muino', 'blokker', 'Muino.nl'],
                
                    task:['Meeting', 'coding'],
                    projectSel: "muino",
                    taskSel: "coding",
                },
                {
                    su: 11,
                    mo: 12,
                    tu: 13,
                    we: 14,
                    th: 15,
                    fr: 16,
                    sa: 17,
                    total: 22,
                    comment: "changes 1",
                    project:  ['muino', 'blokker2', 'Muino.nl'],
                    task:['Meeting', 'coding'],
                    projectSel: "blokker2",
                    taskSel: "Meeting",
                },
                {
                    su: 21,
                    mo: 22,
                    tu: 23,
                    we: 24,
                    th: 25,                                                                                                                        
                    fr: 26,
                    sa: 27,
                    total: 22,
                    comment: "changes 2",
                    project:  ['muino', 'Muino', 'Muino.nl'],
                    task:['Meeting', 'coding'],
                    projectSel: "Muino.nl",
                    taskSel: "Meeting",
                },
                {
                    project:  ['muino', 'hoi', 'Muino.nl'],
                    task:[]
                }
            ]
        }// start from return
    } // function end 


    public get_events(time_start, time_stop, user_id) : Observable<any> {
        // console.log(new Date(time_start),"\n",new  Date(time_stop),user_id);
        
        return Observable.create(observer => {
            this.http.post('/api/prikklok/get_events',{
                user_id,
                time_start,
                time_stop,
                
            }).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }



    public event_create_post(create_events) : Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/prikklok/event',create_events).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    public event_create_put( update_events) : Observable<any> {
        let _id = update_events._id;
        delete update_events._id;

        let url = '/api/prikklok/event/'+_id;
        
        return Observable.create(observer => {

            this.http.put(url,update_events).subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }


    public getproject(): Observable<any> {
        return Observable.create(observer => {
            // get only active projects 
            this.http.get('/api/prikklok/project').subscribe((data: any) => {
                observer.next(data);
                observer.complete();
            })
        });
    }

    // getTestreport(): Observable<any> {
    //     return Observable.create(observer => {
    //         this.http.get('/api/prikklok/events').subscribe((data: any) => {
    //             observer.next(data.deeplearning_testresults);
    //             observer.complete();
    //         })
    //     });
    // }
}

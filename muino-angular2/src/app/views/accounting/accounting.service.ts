import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(private http: HttpClient) { }

  // getproject(): Observable<any> {
  //   return Observable.create(observer => {
  //     this.http.get('/api/prikklok/projects').subscribe((data: any) => {
  //       observer.next(data);
  //       observer.complete();
  //     })
  //   });
  // }



 /**
 * @brief Get project overview part
 * @param None
 * @retval array with jsons if success
 */
  getAccounting(time_start): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/prikklok/accounting', { time_start }).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      })
    });
  }

  /**
 * @brief Get project list with their IDs 
 * @param None
 * @retval array with jsons if success
 */
  getAccountingProjects(getyear): Observable<any> {
    return Observable.create(observer => {
      this.http.get('/api/prikklok/accounting/projectlist/'+getyear).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      })
    });
  }


  /**
 * @brief Get from a project their users and spended time
 * @param None
 * @retval array with jsons if success
 */
  getAccounting_project_info(projectid): Observable<any> {
    return Observable.create(observer => {
      this.http.get('/api/prikklok/accounting/project/' + projectid).subscribe((data: any) => {
        observer.next(data);
        observer.complete();
      })
    });
  }


//     /**
//  * @brief Get all informantion that is needed project->task->event->{user_id,week_hours}
//  * @param None
//  * @retval array with jsons if success
//  */
// getAccounting_project_tasks_events_info(): Observable<any> {
//   return Observable.create(observer => {
//     this.http.get('/api/prikklok/accounting').subscribe((data: any) => {
//       observer.next(data);
//       observer.complete();
//     })
//   });
// }
  
  



}

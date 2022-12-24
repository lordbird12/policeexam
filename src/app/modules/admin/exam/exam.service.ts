import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

const token = localStorage.getItem('accessToken') || null;

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private _examList: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }

  httpOptionsFormdata = {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
  };  

  get examList$(): Observable<ExamService[]>
    {
        return this._examList.asObservable();
    }

    getMyExam(): Observable<any> {
        return this._httpClient
            .get<any>(
                `${environment.API_URL}/api/my_exam`, this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getExamPage(dataBody: any): Observable<DataExam> {
      return this._httpClient
          .post<DataExam>(
              `${environment.API_URL}/api/get_exam_page`, dataBody, this.httpOptionsFormdata
          )
          .pipe(catchError(this.handlerError));
          
        //   return this._httpClient.post<DataExam>(`${environment.API_URL}/api/get_exam_page`, dataBody, this.httpOptionsFormdata).pipe(
        //     tap((response: any) => {
        //         this._examList.next(response);
        //     })
        // );
    }
    

    getExamRound(dataBody: any): Observable<any> {
      return this._httpClient
          .post<any>(
              `${environment.API_URL}/api/get_exam_round`, dataBody, this.httpOptionsFormdata
          )
          .pipe(catchError(this.handlerError));
    }

    getExamFieldMember(dataBody: any): Observable<any> {
      return this._httpClient
          .post<any>(
              `${environment.API_URL}/api/get_exam_exam_field_member`, dataBody, this.httpOptionsFormdata
          )
          .pipe(catchError(this.handlerError));
    }

    RegisterExam(dataBody: any): Observable<any> {
      return this._httpClient
          .post<any>(
              `${environment.API_URL}/api/register_exam`, dataBody, this.httpOptionsFormdata
          )
          .pipe(catchError(this.handlerError));
    }

    ListDoExam(dataBody: any): Observable<any> {
      return this._httpClient
          .post<any>(
              `${environment.API_URL}/api/member_exam_exam`, dataBody, this.httpOptionsFormdata
          )
          .pipe(catchError(this.handlerError));
    }
    
    
    handlerError(error): Observable<never> {
      let errorMessage = 'Error unknown';
      if (error) {
          errorMessage = ` ${error.error.message}`;
      }
      return throwError(errorMessage);
  }
}

export interface DataExam  {
  code: number;
  status: boolean;
  message: string;
  data : {
    current_page: any;
    last_page: any;
    per_page: any;
    data: any[],
    draw: number;
    to: number;
    total: number;
  };
}
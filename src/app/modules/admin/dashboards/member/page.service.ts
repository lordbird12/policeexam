import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

const token = localStorage.getItem('accessToken') || null;
@Injectable({
    providedIn: 'root',
})
export class PageService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getCalendar(): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_exam_round`,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getBanners(): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_banner`,
                this.httpOptionsFormdata
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

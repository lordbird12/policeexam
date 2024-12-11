import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environments/environment';

const token = localStorage.getItem('accessToken') || null;

@Injectable({
    providedIn: 'root',
})
export class ExamService {
    private _examList: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };

    get examList$(): Observable<ExamService[]> {
        return this._examList.asObservable();
    }

    //รายการที่ต้องสอบ
    //แต่ละประเภท Procress : รายการต้องสอบ Finish : ประวัติที่สอบ
    getMyExam(paramUrl: any): Observable<any> {
        return this._httpClient
            .get<any>(
                `${environment.API_URL}/api/my_exam?exam_finish=` + paramUrl,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }


    getExamPage(dataBody: any): Observable<DataExam> {
        return this._httpClient
            .post<DataExam>(
                `${environment.API_URL}/api/get_exam_font_page`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getExamRound(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_exam_round`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getExamFieldMember(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_exam_exam_field_member`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    RegisterExam(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/register_exam`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    Resetpassword(dataBody: any, id: any): Observable<any> {
        return this._httpClient
            .put<any>(
                `${environment.API_URL}/api/reset_password_member/` + id,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }


    //ข้อสอบ
    ListDoExam(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/member_exam_exam`,
                dataBody,
            )
            .pipe(catchError(this.handlerError));
    }

    editProfile(data: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/update_profile_member`,
                data,
            )
            .pipe(catchError(this.handlerError));
    }
    //ส่งข้อสอบ
    SendAnswerExam(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/exam_member_answer`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getExamHistoryFinish(): Observable<any> {
        return this._httpClient
            .get<any>(
                `${environment.API_URL}/api/my_exam?exam_finish=Finish`,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getCountMemberAnswerResult(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_count_exam_member_answer_result`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    checkMemberAuthenkeyExams(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/member_authen_key_exam`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    getCorrectAnswer(paramUrl: any): Observable<any> {
        return this._httpClient
            .get<any>(
                `${environment.API_URL}/api/exam_round_member/` + paramUrl,
                this.httpOptionsFormdata
            )
            .pipe(catchError(this.handlerError));
    }

    //get เวลาที่เหลือในการสอบ ทุกๆ 5 นาที (ที่ต้องแยกเพราะเขามีการปรับเวลาตอนสอบ)
    getExamRoundTimeCount(dataBody: any): Observable<any> {
        return this._httpClient
            .post<any>(
                `${environment.API_URL}/api/get_exam_round_time_count`,
                dataBody,
                this.httpOptionsFormdata
            )
            .pipe(catchError((error: any) => { return of(error.error) }));
    }

    getMe(): Observable<any> {
        return this._httpClient
            .get<any>(
                `${environment.API_URL}/api/me`,
            )
            .pipe(catchError((error: any) => { return of(error.error) }));
    }

    getIPAddress() {
        return fetch('https://api.ipify.org/?format=json')
            .then((response) => response.json())
            .then((data) => data);
    }

    handlerError(error): Observable<never> {
        let errorMessage = { message: 'Error unknown' };
        if (error) {
            errorMessage = error.error;
        }
        return throwError(errorMessage);
    }
}

export interface DataExam {
    code: number;
    status: boolean;
    message: string;
    data: {
        current_page: any;
        last_page: any;
        per_page: any;
        data: any[];
        draw: number;
        to: number;
        total: number;
    };
}

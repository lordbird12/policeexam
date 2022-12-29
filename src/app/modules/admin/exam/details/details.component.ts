import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';


declare var $: any;
const token = localStorage.getItem('accessToken') || null;
const memberKey = localStorage.getItem('memberKey') || "";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit {

    categories: any[];
    courses: any[];
    filteredCourses: any[];
    dataRow: any[];

    showAlert: boolean = false;
    regitExamForm: FormGroup;
    DetailForm: FormGroup;

    dataExams: any;
    dataExamGroup: any;
    dataEx: any;
    examId: any;
    pointEx = 1;

    checkCountSend: any;
    display: any;
    @ViewChild('displayTime', { static: true }) displayTime: ElementRef;

    IPClient : any;
    sesExamTime : any;

    constructor(
        private _authService: AuthService,
        private _examServ: ExamService,
        private helper: HelperFunctionService,
        private router: Router,
        private _formBuilder: FormBuilder,
        private AcRoute: ActivatedRoute
    ) {
        let paramUrl: any = this.AcRoute.snapshot.params;
        this.examId = paramUrl.id ? paramUrl.id : '';
      
        // this.currentTime = `${this.months[this.targetDate.getMonth()] } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

        this.IPClient = sessionStorage.getItem("GetMyIP") ? sessionStorage.getItem("GetMyIP") : '';
    }

    ngOnInit(): void {
        // this.getToDoExams(this.examId);
        let memberkey = localStorage.getItem("memberKey") ? localStorage.getItem("memberKey") : '';
        this.checkMemberAuthenkey(this.examId, memberkey);
        // this.getToDoExams(this.examId);

        console.log('GetMyIP', sessionStorage.getItem("GetMyIP"));
    }

    ngAfterViewInit() {

    }

    timer(minute) {
        // let minute = 1;
        let seconds: number = minute * 60;
        let textSec: any = '0';
        let statSec: number = 60;

        const prefix = minute < 10 ? '0' : '';

        var timer = setInterval(() => {
            // console.log(seconds);
            seconds--;
            if (statSec != 0) statSec--;
            else statSec = 59;

            if (statSec < 10) {
                textSec = '0' + statSec;
            } else {
                textSec = statSec;
            }
            this.displayTime.nativeElement.innerText = `${prefix}${Math.floor(seconds / 60)} : ${textSec}`;
            this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

            if (seconds == 0) {
                console.log('finished');
                clearInterval(timer);
                
                this.dilogEndTimeAnswer();
            }
        }, 1000);
    }

    dilogEndTimeAnswer() {
        Swal.fire({
            title: 'หมดเวลาสอบ!!!',
            html: 'กรุณาออกจากข้อสอบ!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#16a34a',
            confirmButtonText: 'ตกลง',
            allowEscapeKey: false,
            allowOutsideClick: false,
            // cancelButtonText: 'ตกลง, ปิดหน้าต่าง',
        }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/exam/exam-history']);
            }
        });
    }

    checkMemberAuthenkey(exam_id, memberkey): void {
        let body: any = {
            // key: "19495092933328001550",
            key: memberkey,
            exam_id: exam_id,
            ip: this.IPClient
        }
        this.loading();
        this._examServ
            .checkMemberAuthenkeyExams(body)
            .subscribe((resp: any) => {
                if (resp.status == true) {
                    localStorage.setItem("memberKey", resp.data);
                    this.getToDoExams(this.examId);
                }
            }, (error: any) => {
               
                Swal.fire({
                    title: 'คำเตือน!!!',
                    html: 'รหัสของคุณมีการเข้าสอบหลักสูตรซ้อนกัน, <br />กรุณาเข้าสอบช่องทางเดียวเท่านั้น!',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#16a34a',
                    confirmButtonText: 'ตกลง, ออกจากข้อสอบ',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    // cancelButtonText: 'ตกลง, ปิดหน้าต่าง',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.router.navigate(['/exam/exam-todo']);
                    }
                });
            });
    }

    getToDoExams(round_member_id): void {
        // this.loading();
        this._examServ
            .ListDoExam({ exam_round_member_id: round_member_id })
            .subscribe((resp: any) => {
                console.clear();
                this.dataExams = resp;
                this.dataExamGroup = this.dataExams.data.exam_group.exam_group_subjects;
                console.log('dataExamGroup', this.dataExamGroup);
                console.log('dataExams', this.dataExams);
         
                //รับจำนวนเวลาเข้ามาเพื่อ นับถอยหลังเวลสอบ
                this.timer(this.dataExams.data.time_count);
                // this.timer(this.sesExamTime);

                setTimeout(() => {
                    console.log('GetMyIP', this.IPClient);
                    Swal.close();
                }, 1000);
            });
    }

    async AnswerSend(): Promise<void> {
        this.checkLoading();
        let ArrAnswer = [];
        await this.dataExamGroup.forEach(async (sub, x) => {
            await this.dataExamGroup[x].exam_group_subject_questions.forEach(
                async (ques, y) => {
                    let chkVal = await this.checkValueAnswer(
                        ques.main_question_id
                    );
                    ArrAnswer.push(chkVal);
                }
            );
        });
        // console.log("ArrAnswer" , ArrAnswer);
        setTimeout(async () => {
            let NotSend: any = this.containsUndefined(ArrAnswer);
            // console.log(NotSend.__zone_symbol__value);

            if (NotSend.__zone_symbol__value == true) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ส่งคำตอบไม่ครบ!',
                    text: 'กรุณาเลือกคำตอบให้ครบทุกข้อ ก่อนทำการส่งคำตอบ!',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#2196f3',
                });
            }
            else {
                Swal.fire({
                    title: 'คำตอบครบถ้วน',
                    text: 'คุณต้องการส่งคำตอบ ใช่หรือไม่?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'ใช่, ส่งคำตอบ',
                    cancelButtonText: 'ไม่, ปิดหน้าต่าง',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                }).then(async (result) => {

                    if (result.isConfirmed) {
                        let SendAnswer = {
                            exam_round_member_id: this.dataExams.data.exam_round_member_id,
                            member_answer: ArrAnswer
                        };

                        this.checkLoading();
                        this.checkCountSend = {};
                        // console.log("SendAnswer" , SendAnswer);
                        await this._examServ.SendAnswerExam(SendAnswer).subscribe(async (resp: any) => {
                            if (resp.code == "200") {

                                //ยิงเช็คข้อมูลจำนวนครั้งสอบสูงสุด และส่งไปแล้วกี่ครั้ง
                                await this._examServ.getCountMemberAnswerResult({ exam_round_member_id: this.dataExams.data.exam_round_member_id }).
                                    subscribe((countResp: any) => {

                                        this.checkCountSend = countResp;

                                        if (this.checkCountSend.code == "200") {
                                            // console.log("CheckCount" , this.checkCountSend);
                                            if (this.checkCountSend.data.count_answer >= this.checkCountSend.data.exam_limit) {
                                                Swal.fire({
                                                    title: 'ส่งคำตอบสำเร็จ',
                                                    text: `คุณได้คะแนน ${resp.data.score}/${resp.data.exam.question_qty}`,
                                                    icon: 'success',
                                                    showCancelButton: false,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#16a34a',
                                                    confirmButtonText: 'ตกลง, ออกจากข้อสอบ',
                                                    allowEscapeKey: false,
                                                    allowOutsideClick: false,
                                                    // cancelButtonText: 'ตกลง, ปิดหน้าต่าง',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        this.router.navigate(['/exam/exam-history']);
                                                    }
                                                });
                                            }
                                            else {

                                                Swal.fire({
                                                    title: 'ส่งคำตอบสำเร็จ',
                                                    text: `คุณได้คะแนน ${resp.data.score}/${resp.data.exam.question_qty}`,
                                                    icon: 'success',
                                                    showCancelButton: false,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#16a34a',
                                                    confirmButtonText: 'ตกลง, ออกจากข้อสอบ',
                                                    // confirmButtonText: 'สอบใหม่อีกครั้ง',
                                                    // cancelButtonText: 'ตกลง, ออกจากข้อสอบ',
                                                    allowEscapeKey: false,
                                                    allowOutsideClick: false,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                                        //     this.router.navigate(['exam/do-exams', this.examId]);
                                                        // });
                                                        // this.getToDoExams(this.examId);
                                                        this.router.navigate(['/exam/exam-history']);
                                                    }
                                                    else {
                                                        this.router.navigate(['/exam/exam-history']);
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            Swal.fire('พบข้อผิดพลาด', countResp.message, 'error');
                                        }
                                    });

                            }
                            else {
                                Swal.fire('พบข้อผิดพลาด', resp.message, 'error');
                            }
                        }, (error: any) => { 
                            Swal.fire('พบข้อผิดพลาด', error, 'error');
                        });

                    } else {
                        Swal.close();
                        return;
                    }

                });
            }
        }, 1000);
    }

    //เช็คข้อมูล Arr undefind
    async containsUndefined(Arr) {
        return Arr.some((element) => element === undefined);
    }

    //เช็คเอาค่า id ของ radio ของชุดคำถาม
    async checkValueAnswer(NameRadio) {
        var radios: any = document.getElementsByName(NameRadio);
        for (var radio of radios) {
            if (radio.checked) {
                return radio.value;
            }
        }
    }

    async DotSend() {
        Swal.fire('สิ้นสุดการสอบ', 'ไม่ส่งคำตอบได้ กรุณาลงทะเบียนสอบรอบใหม่!', 'warning');
    }

    async loading() {
        Swal.fire({
            title: 'กรุณารอสักครู่ !',
            text: 'กำลังโหลดข้อมูล...', // add html attribute if you want or remove
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            didRender: () => {
                Swal.showLoading(Swal.getDenyButton());
            },
        });
    }

    async checkLoading() {
        Swal.fire({
            icon: 'info',
            title: 'กำลังตรวจข้อมูล... !',
            // html: 'กำลังตรวจข้อมูลคำตอบ...', // add html attribute if you want or remove
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            didRender: () => {
                Swal.showLoading(Swal.getDenyButton());
            },
        });
    }
}

export interface ExamGroup {
    create_by?: string;
    created_at?: any;
    exam_group_id?: number;
    exam_group_subject_questions?: any[];
    exam_subject?: any;
    exam_subject_id?: number;
    id?: number;
    update_by?: string;
    updated_at?: any;
}

export interface DataExams {
    code?: number;
    status?: boolean;
    message?: string;
    data?: {
        id?: number;
        member_id?: string;
        exam_group_id?: number;
        exam_round_member_id?: number;
        create_by?: string;
        update_by?: string;
        created_at?: any;
        updated_at?: any;
        exam_group?: any;
        exam_round_member?: any;
        member?: any;
    };
}

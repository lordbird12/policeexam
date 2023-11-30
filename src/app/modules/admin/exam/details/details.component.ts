import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { DialogCorrectAnswerComponent } from '../dialog-correct-answer/dialog-correct-answer.component';

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

    IPClient: any;
    ExamRound_ExamId: any;
    sesExamTime: any;

    constructor(
        private _authService: AuthService,
        private _examServ: ExamService,
        private helper: HelperFunctionService,
        private router: Router,
        private _formBuilder: FormBuilder,
        private AcRoute: ActivatedRoute,
        private _matDialog: MatDialog
    ) {
        let paramUrl: any = this.AcRoute.snapshot.params;
        this.examId = paramUrl.id ? paramUrl.id : '';

        // this.currentTime = `${this.months[this.targetDate.getMonth()] } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

        this.IPClient = sessionStorage.getItem("GetMyIP") ? sessionStorage.getItem("GetMyIP") : '';
        this.ExamRound_ExamId = sessionStorage.getItem("ExamRound_ExamId") ? sessionStorage.getItem("ExamRound_ExamId") : '';
    }

    ngOnInit(): void {
        // this.getToDoExams(this.examId);
        let memberkey = localStorage.getItem("memberKey") ? localStorage.getItem("memberKey") : '';

        //เช็คเข้าใช้คนเดียวหรือไม่ แล้วดึงข้อสอบ
        this.checkMemberAuthenkey(this.ExamRound_ExamId, memberkey);

        //ดึงข้อสอบ
        // this.getToDoExams(this.examId);
        // console.log('GetMyIP', sessionStorage.getItem("GetMyIP"));
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

            // เช็คปรับเวลาข้อสอบ
            // if (Math.floor(seconds / 60) == 5) {
            //     this._examServ.getExamRoundTimeCount({ exam_round_id: this.dataExams.data.exam_round_member.exam_round_id }).subscribe((resp: any) => {
            //         seconds = seconds + resp.data * 60;
            //         console.log("getExamRoundTimeCount", resp.data * 60)
            //     });
            // }
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
            // ip: this.IPClient
        }
        this.loading();
        this._examServ.checkMemberAuthenkeyExams(body).subscribe((resp: any) => {

            if (resp.status == true) {
                localStorage.setItem("memberKey", resp.data);
                this.getToDoExams(this.examId);
            }

        }, (error: any) => {
            Swal.fire({
                title: 'คำเตือน !! [' + error.code + ']',
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
                // console.log('dataExamGroup', this.dataExamGroup);
                // console.log('dataExams', this.dataExams);

                //รับจำนวนเวลาเข้ามาเพื่อ นับถอยหลังเวลสอบ
                this.timer(this.dataExams.data.time_count);
                // this.timer(this.sesExamTime);

                setTimeout(() => {
                    this.CheckDataAnswer();
                    // console.log('GetMyIP', this.IPClient);
                    // this.getExamRoundTimeCount(this.dataExams.data);
                    setTimeout(() => {
                        Swal.close();
                    }, 500);
                }, 500);
            });
    }

    //คลิกคำตอบแล้วทำการเก็บค่า ที่ checked ไว้
    async AnswerClick(): Promise<void> {
        let ArrAnswer = [];
        let chkVal: any;
        await this.dataExamGroup.forEach(async (sub, x) => {
            await this.dataExamGroup[x].exam_group_subject_questions.forEach(async (ques, y) => {

                await this.dataExamGroup[x].exam_group_subject_questions[y].exam_group_subject_answers.forEach(async (subanws, y) => {
                    //เช็คข้อมูลเอา group_subject_question_id มาหาชื่อ radio เพื่อ get value
                    chkVal = await this.checkValueAnswer(
                        subanws.group_subject_question_id
                    );
                });

                //return value ที่เป็น id ใน exam_group_subject_answers
                ArrAnswer.push(chkVal);
            });
        });
        // console.log("ArrAnswer", ArrAnswer);

        setTimeout(() => {
            let AnswerData = {
                round_id: this.dataExams.data.exam_round_member_id,
                member_Ans: ArrAnswer
            };
            localStorage.setItem("AnswerUser", JSON.stringify(AnswerData));
            //console.log("Answer", JSON.parse(localStorage.getItem("AnswerUser")));
        }, 100);
    }

    //ใช้ JQuery มา checked by id โดย id คือ หมายเลขคำตอบของข้อสอบ
    async CheckDataAnswer(): Promise<void> {
        let DataList : any = JSON.parse(localStorage.getItem("AnswerUser"));

        if(DataList.member_Ans.length > 0) {
            //เช็คข้อสอบชุดเดียวกันหรือไม่
            if(DataList.round_id == this.examId) {
                await DataList.member_Ans.forEach(async (item, x) => {
                    $("#" + item).prop("checked", true);
                });
            }
            else {
                localStorage.removeItem("AnswerUser");
            }
        }
        else {
            localStorage.removeItem("AnswerUser");
        }
    }


    async AnswerSend(): Promise<void> {
        this.checkLoading();
        let ArrAnswer = [];
        let chkVal: any;

        await this.dataExamGroup.forEach(async (sub, x) => {
            await this.dataExamGroup[x].exam_group_subject_questions.forEach(async (ques, y) => {

                await this.dataExamGroup[x].exam_group_subject_questions[y].exam_group_subject_answers.forEach(async (subanws, y) => {
                    //เช็คข้อมูลเอา group_subject_question_id มาหาชื่อ radio เพื่อ get value
                    chkVal = await this.checkValueAnswer(
                        subanws.group_subject_question_id
                    );
                });

                //return value ที่เป็น id ใน exam_group_subject_answers
                ArrAnswer.push(chkVal);
            });
        });
        // console.log("ArrAnswer", ArrAnswer);

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
                        this.checkLoading();
                        this.checkCountSend = {};
                        //ยิงเช็คข้อมูลจำนวนครั้งสอบสูงสุด และส่งไปแล้วกี่ครั้ง
                        await this._examServ.getCountMemberAnswerResult({ exam_round_member_id: this.dataExams.data.exam_round_member_id }).
                            subscribe(async (countResp: any) => {

                                this.checkCountSend = countResp;
                                let SendAnswer = {
                                    exam_round_member_id: this.dataExams.data.exam_round_member_id,
                                    member_answer: ArrAnswer
                                };
                                // console.log("SendAnswer" , SendAnswer);
                                if (this.checkCountSend.code == "200") {
                                    // console.log("CheckCount" , this.checkCountSend);

                                    // หากส่งคำตอบยังเกินจำนวนครั้งที่กำหนด
                                    if (this.checkCountSend.data.count_answer >= this.checkCountSend.data.exam_limit) {
                                        Swal.fire({
                                            title: 'ไม่สามารถส่งคำตอบได้',
                                            text: `เนื่องจากคุณส่งคำตอบเกิดจำนวนครั้งที่กำหนด ในการส่งคำตอบแล้ว!`,
                                            icon: 'warning',
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
                                                localStorage.removeItem("AnswerUser");
                                            }
                                        });
                                    }
                                    else {
                                        // หากส่งคำตอบยังไม่เกินจำนวนครั้งที่กำหนด
                                        // ยิงส่งคำตอบ
                                        await this._examServ.SendAnswerExam(SendAnswer).subscribe(async (resp: any) => {
                                            if (resp.code == "200") {

                                                //เช็คคะแนนว่ามีค่าหรือไม่ score = null ส่งคำตอบแบบไม่แสดงคะแนน
                                                if(!resp.data.score){
                                                    Swal.fire({
                                                        title: 'ส่งคำตอบสำเร็จ',
                                                        text: `ขอบคุณที่ทำข้อสอบ, ขอให้โชคดีในคำตอบนะครับ`,
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
                                                            this.router.navigate(['/exam/exam-history']);
                                                        }
                                                    });
                                                }
                                                else {
                                                    //score > 0 ส่งคำตอบแบบแสดงคะแนน
                                                    Swal.fire({
                                                        title: 'ส่งคำตอบสำเร็จ',
                                                        html: `คุณได้คะแนน ${resp.data.score}/${resp.data.exam.question_qty} <br /> ต้องการดูผลเฉลยข้อสอบ หรือไม่ ?`,
                                                        icon: 'success',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#999999',
                                                        confirmButtonText: 'ตกลง, ดูผลเฉลยข้อสอบ',
                                                        // confirmButtonText: 'สอบใหม่อีกครั้ง',
                                                        cancelButtonText: 'ไม่ดูผลสอบ, ออกจากข้อสอบ',
                                                        allowEscapeKey: false,
                                                        allowOutsideClick: false,
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {

                                                            this.openDialogCorrectAnswers(SendAnswer.exam_round_member_id);

                                                            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                                            //     this.router.navigate(['exam/do-exams', this.examId]);
                                                            // });
                                                            // this.getToDoExams(this.examId);
                                                        }
                                                        else {
                                                            localStorage.removeItem("AnswerUser");
                                                            // this.router.navigate(['/exam/exam-history']);
                                                            this.router.navigate(['/exam/exam-todo']);
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                Swal.fire('พบข้อผิดพลาด', resp.message, 'error');
                                            }
                                        },
                                        (error: any) => {
                                            Swal.fire('พบข้อผิดพลาด [' + error.code + ']', error.message, 'error');
                                        });
                                    }
                                }
                                else {
                                    Swal.fire('พบข้อผิดพลาด', countResp.message, 'error');
                                }

                            },
                            (error: any) => {
                                Swal.fire('พบข้อผิดพลาด [' + error.code + ']', error.message, 'error');
                            });

                    } else {
                        //ปิดหน้าต่าง
                        Swal.close();
                        return;
                    }

                });
            }
        }, 2000);
    }

    //ดูผลเฉลยข้อสอบหลังส่งคำตอบ
    openDialogCorrectAnswers(examId) {
        this._matDialog.open(DialogCorrectAnswerComponent, {
            disableClose: true,
            width: '800px',
            height: '650px',
            data: { exam_round_member_id: examId }
        })
            .afterClosed()
            .subscribe(res => {
                // console.log("res", res);
                this.router.navigateByUrl('/exam/exam-todo', { skipLocationChange: true });
                localStorage.removeItem("AnswerUser");
            });
    }


    //เช็คข้อมูล Arr undefind
    async containsUndefined(Arr) {
        return Arr.some((element) => element === undefined);
    }

    //เช็คเอาค่า name ของ radio ที่ใช้ของชุดคำถามเป็น name และวนดึงค่าที่ checked เพื่อเก็บ value
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

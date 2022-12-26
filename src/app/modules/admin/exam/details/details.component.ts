import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
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

    constructor(
        private _authService: AuthService,
        private _examServ: ExamService,
        private helper: HelperFunctionService,
        private rou: Router,
        private _formBuilder: FormBuilder,
        private AcRoute: ActivatedRoute
    ) {
        let paramUrl: any = this.AcRoute.snapshot.params;
        this.examId = paramUrl.id ? paramUrl.id : '';
    }

    ngOnInit(): void {
        // console.log('examId', this.examId);
        this.getToDoExams(this.examId);
    }

    getToDoExams(examId): void {
        this.loading();
        this._examServ
            .ListDoExam({ exam_id: examId })
            .subscribe((resp: any) => {
                console.clear();
                this.dataExams = resp;
                // this.dataEx = this.dataExams.data;
                this.dataExamGroup = this.dataExams.data[0].exam_group.exam_group_subjects;
                // console.log('dataExams', this.dataExams);
                // console.log('dataExamGroup', this.dataExamGroup);

                setTimeout(() => {
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
            } else {
                Swal.fire({
                    title: 'คำตอบครบถ้วน',
                    text: 'คุณต้องการส่งคำตอบ ใช่หรือไม่?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'ใช่, ส่งคำตอบ',
                    cancelButtonText: 'ไม่, ปิดหน้าต่าง',
                }).then(async (result) => {

                    if (result.isConfirmed) {
                        let SendAnswer = {
                          exam_round_member_id: this.dataExams.data[0].exam_round_member_id,
                          member_answer: ArrAnswer
                        };
                        // console.log("SendAnswer" , SendAnswer);
                        this._examServ.SendAnswerExam(SendAnswer).subscribe((resp: any) => {
                          if(resp.status == true) {
                            Swal.fire({
                              title: 'ส่งคำตอบสำเร็จ',
                              text: `คุณได้คะแนน ${resp.data.score} / ${resp.data.exam.question_qty}`,
                              icon: 'success',
                              showCancelButton: false,
                              confirmButtonText: 'ตกลง',
                              confirmButtonColor: '#2196f3',
                            }).then((result) => {
                              this.rou.navigate(['/exam/exam-todo']);
                            });
                          }
                          else {
                            Swal.fire('พบข้อผิดพลาด','ไม่สามารถส่งคำตอบได้ กรุณาเข้าใช้งานระบบใหม่!', 'error');
                          }
                        });

                    } else {
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
      Swal.fire('สิ้นสุดการสอบ','ไม่ส่งคำตอบได้ กรุณาลงทะเบียนสอบรอบใหม่!', 'warning');
    }

    async loading() {
        Swal.fire({
            title: 'กรุณารอสักครู่ !',
            html: 'กำลังโหลดข้อมูล...', // add html attribute if you want or remove
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
          title: 'กำลังตรวจข้อมูลคำตอบ !',
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

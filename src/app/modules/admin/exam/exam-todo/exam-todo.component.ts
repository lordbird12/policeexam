import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogCorrectAnswerComponent } from '../dialog-correct-answer/dialog-correct-answer.component';

declare var $: any;
const token = localStorage.getItem('accessToken') || null;

@Component({
  selector: 'app-exam-todo',
  templateUrl: './exam-todo.component.html',
  styleUrls: ['./exam-todo.component.scss'],
})
export class ExamTodoComponent implements OnInit {

  categories: any[];
  courses: any[];
  filteredCourses: any[];
  dataRow: any[];

  showAlert: boolean = false;
  regitExamForm: FormGroup;
  DetailForm: FormGroup;

  dataExam: any;
  dataArrExam = [];
  ipAddress: any;

  constructor(private _authService: AuthService, private _examServ: ExamService, private helper: HelperFunctionService,
    private rou: Router, private _formBuilder: FormBuilder, private _httpClient: HttpClient,
    private _matDialog: MatDialog, private _changeDetectorRef: ChangeDetectorRef,) {


  }

  ngOnInit(): void {
    this.loading();
    this.getIPClient();

    setTimeout(() => {
      this.getExamList();
    }, 1500);
  }

  doExample(ArrData: any): void {
    //console.log("ArrData", ArrData);
    // let ipAddress: any = sessionStorage.getItem("GetMyIP") ? sessionStorage.getItem("GetMyIP") : '';

    // if (!ipAddress) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'พบข้อผิดพลาด!',
    //     text: 'กรุณาลองเข้าใช้งานระบบใหม่!',
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: '#2196f3',
    //   });
    //   sessionStorage.setItem("ExamRound_ExamId", "");
    // }
    // else {
    //   this.rou.navigate(['/exam/do-exams', ArrData.id]);
    //   sessionStorage.setItem("ExamRound_ExamId", ArrData.exam_round.exam.id);
    // }
    this.rou.navigate(['/exam/do-exams', ArrData.id]);
    sessionStorage.setItem("ExamRound_ExamId", ArrData.exam_round.exam.id);
  }

  openDialogCorrectAnswers() {
    this._matDialog.open(DialogCorrectAnswerComponent, {
      disableClose: true,
      width: '800px',
      height: '650px',
      data: { exam_round_member_id: 24 }
    })
      .afterClosed()
      .subscribe(res => {
        // console.log("res", res);
        this.rou.navigate(['/exam/list']);
      });
  }


  getIPClient(): void {
    this._examServ.getIPAddress().then((res) => {
      // console.log("IP", res);
      this.ipAddress = res.ip ? res.ip : '';
      sessionStorage.setItem("GetMyIP", this.ipAddress);
    });
  }

  //ดูรายการสอบ แต่ละประเภท Procress : รายการต้องสอบ Finish : ประวัติที่สอบ
  getExamList(): void {
    this._examServ.getMyExam("Procress").subscribe((resp: any) => {
      console.clear();
      this.dataExam = resp;
      console.log(this.dataExam);
      // console.log("dataExam", this.dataExam.data[0].exam_agian_status);

      setTimeout(() => {
        Swal.close();
      }, 1000);
    },
      (error: any) => {
        Swal.fire('พบข้อผิดพลาด [' + error.code + ']', error.message, 'error');
      });
  }

  async loading() {
    Swal.fire({
      title: 'กรุณารอสักครู่ !',
      html: 'กำลังโหลดข้อมูล...',// add html attribute if you want or remove
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      didRender: () => {
        Swal.showLoading(Swal.getDenyButton())
      },
    });
  }
}

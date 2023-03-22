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
  selector: 'app-correct-answers',
  templateUrl: './correct-answers.component.html',
  styleUrls: ['./correct-answers.component.scss']
})
export class CorrectAnswersComponent implements OnInit {
  
  categories: any[];
  courses: any[];
  filteredCourses: any[];
  dataRow: any[];

  showAlert: boolean = false;
  regitExamForm: FormGroup;
  DetailForm: FormGroup;
  examId: any;
  dataExamAnswer: any;
  dataArrExam = [];

  constructor(
    private _authService: AuthService,
    private _examServ: ExamService,
    private helper: HelperFunctionService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private AcRoute: ActivatedRoute) {

        let paramUrl: any = this.AcRoute.snapshot.params;
        this.examId = paramUrl.id ? paramUrl.id : '';
    }


  ngOnInit(): void {
    this.getCorrectAnswer();
  }

  getCorrectAnswer(): void {
    this.loading();
    this._examServ.getCorrectAnswer(this.examId).subscribe((resp : any) => {
      console.clear();
      this.dataExamAnswer = resp;
      // console.log("history", this.dataExamAnswer);

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

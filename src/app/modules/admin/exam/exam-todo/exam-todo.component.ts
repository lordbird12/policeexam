import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';

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

  constructor(private _authService: AuthService, private _examServ: ExamService, private helper: HelperFunctionService,
    private rou: Router, private _formBuilder: FormBuilder) {


    }

    ngOnInit(): void {
      this.getExamList();
    }

    doExample(ArrData): void {
      // console.log("ArrData", ArrData);
       this.rou.navigate(['/exam/do-exams' , ArrData.exam_id])
    }

    getExamList(): void {
      this.loading();
      this._examServ.getMyExam().subscribe((resp : any) => {
        console.clear();
        this.dataExam = resp;
        // console.log("dataExam", this.dataExam);

        setTimeout(() => {
          Swal.close();
        }, 500);
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

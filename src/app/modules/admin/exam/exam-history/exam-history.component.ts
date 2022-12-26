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
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss']
})
export class ExamHistoryComponent implements OnInit {
  categories: any[];
  courses: any[];
  filteredCourses: any[];
  dataRow: any[];

  showAlert: boolean = false;
  regitExamForm: FormGroup;
  DetailForm: FormGroup;

  dataExamHistory: any;
  dataArrExam = [];

  constructor(private _authService: AuthService, private _examServ: ExamService, private helper: HelperFunctionService,
    private rou: Router, private _formBuilder: FormBuilder) {


    }

    ngOnInit(): void {
      this.getExamHistoryFinish();
    }

    getExamHistoryFinish(): void {
      this.loading();
      this._examServ.getExamHistoryFinish().subscribe((resp : any) => {
        console.clear();
        this.dataExamHistory = resp;
        // console.log("history", this.dataExamHistory);

        setTimeout(() => {
          Swal.close();
        }, 1000);
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

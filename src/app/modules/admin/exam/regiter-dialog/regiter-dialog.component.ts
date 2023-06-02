
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
const token = localStorage.getItem('accessToken') || null;

@Component({
  selector: 'app-regiter-dialog',
  templateUrl: './regiter-dialog.component.html',
  styleUrls: ['./regiter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegiterDialogComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };

  categories: any[];
  courses: any[];
  filteredCourses: any[];
  filters: {
    categorySlug$: BehaviorSubject<string>;
    query$: BehaviorSubject<string>;
    hideCompleted$: BehaviorSubject<boolean>;
  } = {
      categorySlug$: new BehaviorSubject('all'),
      query$: new BehaviorSubject(''),
      hideCompleted$: new BehaviorSubject(false)
    };

  private destroy$ = new Subject<any>();
  dataRow: any[];
  dtTrigger: Subject<any> = new Subject<any>();

  regitExamForm: FormGroup;
  DetailForm: FormGroup;
  showAlert: boolean = false;

  dataMyExam: any;
  dataArrExam = [];
  dataExamPage: any;
  dataExamRound: any;
  dataFieldMember: any;

  displayDialog : any = {};

  constructor(@Inject(MAT_DIALOG_DATA) private _dataExt: { data?: any }, private _authService: AuthService, private _examServ: ExamService,
    public helper: HelperFunctionService, private rou: Router, 
    private _formBuilder: FormBuilder, private matDialogRef: MatDialogRef<RegiterDialogComponent>) {

    this.regitExamForm = this._formBuilder.group({
      exam_round_id: ['', Validators.required],
      exam_field_id: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    console.log(this._dataExt.data);

    if(this._dataExt.data.exam_id) {
      this.loading();
    
      this.getDropDownExamRound(this._dataExt.data.exam_id);
      this.getDropDownExamFieldMemmer(this._dataExt.data.exam_id);

      this.displayDialog = this._dataExt.data;

      setTimeout(async () => {
        Swal.close();
      }, 1000);
    }
    else {
      this.displayDialog = {};
      this.dataExamRound = [];
      this.dataExamRound = [];
    }
    
  }

  closeDialog(): void {
    this.matDialogRef.close('successful');
  }


  getDropDownExamRound(examId): void {
    
    this.dataExamRound = [];
    this._examServ.getExamRound({ exam_id: examId }).subscribe((response) => {
      this.dataExamRound = response.data ? response.data : [];
      // console.log("ExamRound",  this.dataExamRound);
    });
  }

  getDropDownExamFieldMemmer(examId): void {
    this.dataExamRound = [];
    this._examServ.getExamFieldMember({ exam_id: examId }).subscribe((response) => {

      this.dataFieldMember = response.data ? response.data : [];
      // console.log("FieldMember",  this.dataFieldMember);
    });
  }

  RegiterExam(): void {
    // Disable the form
    this.regitExamForm.disable();
    console.log("save", this.regitExamForm.value);

    if(!this.regitExamForm.value.exam_round_id || !this.regitExamForm.value.exam_field_id) {
      Swal.fire({
        icon: 'error',
        title: 'พบข้อผิดพลาด!',
        text: 'กรุณาระบุรอบที่สอบ และสนามสอบให้ครบถ้วน!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2196f3',
      });
      this.regitExamForm.enable();
      return;
    }
    else {
      Swal.fire({
        title: 'ลงทะเบียนสอบ',
        text: "คุณต้องการรายวิชานี้ ใช่หรือไม่?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลงทะเบียน',
        cancelButtonText: 'ไม่, ปิดหน้าต่าง'
      }).then((result) => {
        if (result.isConfirmed) {
          this._examServ.RegisterExam(this.regitExamForm.value).subscribe((response) => {
            // console.log("RegisterExam",  response.data);
            if(response.status == true) {
              Swal.fire({
                title: 'ลงทะเบียนสำเร็จ',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2196f3',
              }).then((result) => {
                this.matDialogRef.close('successful');
              });
            }
            else {
              this.regitExamForm.enable();
              Swal.fire('พบข้อผิดพลาด', response.message, 'error');
            }
          }, 
          (error: any) => {
              this.regitExamForm.enable();
              Swal.fire('พบข้อผิดพลาด [' + error.code + ']', error.message, 'error');
          });
        }
        else {
          this.regitExamForm.enable();
          return; 
        }
      });
    }

  }

  async clerData() {
    this.displayDialog = {
      exam_id: "",
      Name:  "",
      year:  "",
      register_end_date:  "",
      register_start_date :  "",
      question_qty:  "",
      exam_time:  0,
      line_work_id :  "",
      line_work_name :  "",
    };
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

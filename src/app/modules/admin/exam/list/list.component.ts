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
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

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
  
  displayDialog : any = {
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


  constructor(private _authService: AuthService, private _examServ: ExamService, public helper: HelperFunctionService,
    private rou: Router, private _formBuilder: FormBuilder) {

    this.regitExamForm = this._formBuilder.group({
      exam_round_id: ['', Validators.required],
      exam_field_id: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    // console.log(token);
    this.getPageListExam();
  }

  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
    // this.destroy$.next({});
    // this.destroy$.complete();
  }

  getPageListExam(): void {
    let getBody = {
      "line_work_id": null,
      "status": null,
      "draw": 1,
      "columns": [],
      "order": [{
        "column": 1,
        "dir": "asc"
      }],
      "start": 0,
      "length": 10,
      "search": {
        "value": "",
        "regex": false
      }
    };
    this.loading();
    this._examServ.getExamPage(getBody).subscribe((response) => {
      console.clear();
      // this.dataArrExam = response.data.data;
      this.dataMyExam = response.data;
     
      setTimeout(() => {
        Swal.close();
      }, 500);
    });
  }

  actionClickDialog(type: any): void {
    var openButton = document.getElementById('open');
    var dialog = document.getElementById('dialog');
    var closeButton = document.getElementById('close');
    var overlay = document.getElementById('overlay');

    if (type == "Open") {
      dialog.classList.remove('hidden');
      overlay.classList.remove('hidden');
      this.regitExamForm.reset();
      this.regitExamForm.enable();
    }
    else {
      dialog.classList.add('hidden');
      overlay.classList.add('hidden');
      this.regitExamForm.enable();
    }
  }

  detailExam(item): void  {
    console.log("item", item);
    if(!item) {
      Swal.fire({
        icon: 'error',
        title: 'พบข้อผิดพลาด!',
        text: 'กรุณาลองเข้าใช้งานระบบใหม่!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2196f3',
      });
      return;
    }
    else {
      this.loading();

      this.displayDialog = {
        exam_id: item.id,
        Name: item.name,
        year: item.year,
        register_end_date: this.helper.reverseDateSplitKed(item.register_end_date),
        register_start_date : this.helper.reverseDateSplitKed(item.register_start_date),
        question_qty: item.question_qty,
        exam_time: item.exam_time,
        line_work_id :  item.line_work.line_work_id,
        line_work_name : item.line_work.name
      }

      this.getDropDownExamRound(item.id);
      this.getDropDownExamFieldMemmer(item.id);
      
      setTimeout(async () => {
        Swal.close();
      }, 1000);
    }
   
  }

  getDropDownExamRound(examId): void {
    this.actionClickDialog('Open');
    
    this.dataExamRound = [];
    this._examServ.getExamRound({ exam_id: examId }).subscribe((response) => {
      this.dataExamRound = response.data;
      // console.log("ExamRound",  this.dataExamRound);
    });
  }

  getDropDownExamFieldMemmer(examId): void {
    this.dataExamRound = [];
    this._examServ.getExamFieldMember({ exam_id: examId }).subscribe((response) => {

      this.dataFieldMember = response.data;
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

            Swal.fire({
              title: 'ลงทะเบียนสำเร็จ',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#2196f3',
            }).then((result) => {
              this.actionClickDialog('Close');
            });

          });
        }
        else {
          this.regitExamForm.enable();
          return; 
        }
      });
    }

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


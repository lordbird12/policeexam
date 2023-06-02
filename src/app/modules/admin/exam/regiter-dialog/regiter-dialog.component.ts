
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

  constructor(@Inject(MAT_DIALOG_DATA) private _data: { data?: any }, private _authService: AuthService, private _examServ: ExamService,
    public helper: HelperFunctionService, private rou: Router, 
    private _formBuilder: FormBuilder, private matDialogRef: MatDialogRef<RegiterDialogComponent>) {

    this.regitExamForm = this._formBuilder.group({
      exam_round_id: ['', Validators.required],
      exam_field_id: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    console.log(this._data)
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }

}

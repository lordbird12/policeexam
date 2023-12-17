
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';

declare var $: any;
const token = localStorage.getItem('accessToken') || null;
// const user = localStorage.getItem('user') || null;

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

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

  resetPassword: FormGroup

  regitExamForm: FormGroup;
  DetailForm: FormGroup;
  UserId: string;
  showAlert: boolean = false;

  dataMyExam: any;
  dataArrExam = [];
  dataExamPage: any;
  dataExamRound: any;
  dataFieldMember: any;

  displayDialog: any = {
    exam_id: "",
    Name: "",
    year: "",
    register_end_date: "",
    register_start_date: "",
    question_qty: "",
    exam_time: 0,
    line_work_id: "",
    line_work_name: "",
  };


  AgencyCommandId = new FormControl();
  filteredAgencyCommand: Observable<string[]>;
  selectedAgencyCommand: string = '';
  searchAgencyCommand: string = '';
  public acmData: any = [];
  public acmFilter: any = [];

  //sub agency command
  SubAgencyCommandId = new FormControl();
  filteredSubAgencyCommand: Observable<string[]>;
  selectedSubAgencyCommand: string = '';
  searchSubAgencyCommand: string = '';
  public subagencycommandData: any = [];
  public subagencycommandFilter: any = [];

  //affiliation
  AffiliationId = new FormControl();
  filteredAffiliation: Observable<string[]>;
  selectedAffiliation: string = '';
  searchAffiliation: string = '';
  public affiliationData: any = [];
  public affiliationFilter: any = [];

  //position
  PositionId = new FormControl();
  filteredPosition: Observable<string[]>;
  selectedPosition: string = '';
  public positionData: any = [];
  public positionFilter: any = [];

  //prefix type
  PrefixTypeId = new FormControl();
  filteredPrefixType: Observable<string[]>;
  selectedPrefix: string = '';
  selectedPrefixType: string = '';
  public prefixtypeData: any = [];
  public prefixtypeFilter: any = [];

  //prefix
  PrefixId = new FormControl();
  filteredPrefix: Observable<string[]>;
  searchPrefix: any;
  public prefixData: any = [];
  public prefixFilter: any = [];

  userType: any = [
      { value: '1', status: false, name: 'ประชาชนทั่วไป' },
      { value: '2', status: true, name: 'ข้าราชการตำรวจ' },
  ];

  userTypeSelect: any = 1;

  file_store: FileList;
  file_list: Array<string> = [];

  imageUrl: any =
      'assets/images/no_pic.png';
  editFile: boolean = true;
  removeUpload: boolean = false;

  datestart: any;

  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;

  dayOptions: number[];
  monthOptions: number[];
  yearOptions: number[];
  form: FormGroup
  constructor(private _authService: AuthService, private _examServ: ExamService, public helper: HelperFunctionService,
    private rou: Router, private _formBuilder: FormBuilder) {

    this.regitExamForm = this._formBuilder.group({
      exam_round_id: ['', Validators.required],
      exam_field_id: ['', Validators.required],
    });

    this.resetPassword = this._formBuilder.group({
      password: '',
      new_password: '',
      confirm_new_password: '',
    })

    this.form = this._formBuilder.group({
        id: [],
        agency_command_id: [],
        sub_agency_command_id: [],
        affiliation_id: [],
        prefix_type_id: [],
        prefix_id: [],
        position_id: [],
        member_id: [],
        fname: [],
        lname: [],
        image: [''],
        birth_date: [],
        sex: [],
        position_remark: [''],
        division: [],
        division_remark: [''],
        email: ['', Validators.email],
        telephone: [''],
        password: [''],
        type: [''],
    })

  }

  ngOnInit(): void {
    let item = localStorage.getItem('user')
    let user = JSON.parse(item)
    this.UserId = user.id;
    this._examServ.getMe().subscribe((resp: any)=>{
        console.log
        this.form.patchValue({
            ...resp.data,
            prefix_type_id: resp.data.prefix_type.name,
            prefix_id: resp.data.prefix.name,
            affiliation_id: resp.data.affiliation.name,
            sub_agency_command_id: resp.data.sub_agency_command.name,
            position_id: resp.data.position.name,
            agency_command_id: resp.data.agency_command.name

        })

    })
    // alert(1);

  }

  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
    // this.destroy$.next({});
    // this.destroy$.complete();
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

  EditProfile(): void {
    // Disable the form
    Swal.fire({
        title: 'บันทึกข้อมูล ',
        text: "คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
      }).then((result) => {
        if (result.isConfirmed) {
          this._examServ.editProfile(this.form.value).subscribe((response) => {
            // console.log("RegisterExam",  response.data);
            if (response.status == true) {
              Swal.fire({
                title: 'บันทึกข้อมูลสำเร็จ',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2196f3',
              }).then((result) => {
                this.actionClickDialog('Close');
              });
              this.resetPassword.reset();
              this.resetPassword.enable();
            }
            else {
              this.resetPassword.enable();
              Swal.fire('พบข้อผิดพลาด', response.message, 'error');
            }
          },
            (error: any) => {
              this.resetPassword.enable();
              Swal.fire('พบข้อผิดพลาด [' + error.code + ']', error.message, 'error');
            });
        }
        else {
          this.resetPassword.enable();
          return;
        }
      });

  }

  async clerData() {
    this.displayDialog = {
      exam_id: "",
      Name: "",
      year: "",
      register_end_date: "",
      register_start_date: "",
      question_qty: "",
      exam_time: 0,
      line_work_id: "",
      line_work_name: "",
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


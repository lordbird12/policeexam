import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PageService } from '../page.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';

declare var $: any;
const token = localStorage.getItem('accessToken') || null;

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };



    regitExamForm: FormGroup;
    DetailForm: FormGroup;
    showAlert: boolean = false;

    dataMyExam: any;
    dataArrExam = [];
    dataExamPage: any;
    dataExamRound: any;
    dataFieldMember: any;

    displayDialog: any = {
        exam_id: '',
        Name: '',
        year: '',
        register_end_date: '',
        register_start_date: '',
        question_qty: '',
        exam_time: 0,
        line_work_id: '',
        line_work_name: '',
    };

    //linework
    LineWorkId = new FormControl();
    filteredLineWork: Observable<string[]>;
    selectedLineWork: string = '';
    public lineworkData: any = [];
    public lineworkFilter: any = [];

    constructor(
        private _authService: AuthService,
        private _examServ: PageService,
        public helper: HelperFunctionService,
        private rou: Router,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.regitExamForm = this._formBuilder.group({
            exam_round_id: ['', Validators.required],
            exam_field_id: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // console.log(token);
        

        this.GetLinework();
        this.filteredLineWork = this.LineWorkId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterLinework(value || ''))
        );
    }

    private _filterLinework(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.lineworkData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    GetLinework(): void {
        this._examServ.getLinework().subscribe((resp) => {
            this.lineworkData = resp.data;
        });
    }

    ngOnDestroy(): void {
        // this.dtTrigger.unsubscribe();
        // this.destroy$.next({});
        // this.destroy$.complete();
    }

    getPageListExam(id: any): void {
        this.loading();
        this._examServ.getExamPage(id).subscribe((response) => {
            this.dataMyExam = response.data;
            this._changeDetectorRef.markForCheck();
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

        if (type == 'Open') {
            dialog.classList.remove('hidden');
            overlay.classList.remove('hidden');
            this.regitExamForm.reset();
            this.regitExamForm.enable();
        } else {
            dialog.classList.add('hidden');
            overlay.classList.add('hidden');
            this.regitExamForm.enable();
        }
    }

    detailExam(item): void {
        // console.log("item", item);
        if (!item.pdf) {
            Swal.fire({
                icon: 'error',
                title: 'พบข้อผิดพลาด!',
                text: 'ไม่พบข้อมูลไฟล์เอกสารที่ท่านเลือก!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#2196f3',
            });
            return;
        } else {
            this.loading();

            window.open(item.pdf);
            setTimeout(async () => {
                Swal.close();
            }, 1000);
        }
    }







    displayLinework(subject) {
      // return subject ? subject.province : undefined;
      if (!subject) return '';
      let index = this.lineworkData.findIndex(
          (state) => state.line_work_id === subject
      );

      // this.signUpForm.patchValue({
      //     position_id: this.positionData[index].position_id,
      // });

      this.getPageListExam(subject);

      return this.lineworkData[index].name;
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
}

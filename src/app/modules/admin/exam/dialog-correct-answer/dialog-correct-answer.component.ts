import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseValidators } from '@fuse/validators';
import { debounceTime, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-correct-answer',
  templateUrl: './dialog-correct-answer.component.html',
  styleUrls: ['./dialog-correct-answer.component.scss']
})
export class DialogCorrectAnswerComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

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

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private _data: { exam_round_member_id?: any },
    private _examService: ExamService,
    private _formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<DialogCorrectAnswerComponent>,
    private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit(): void {
    // console.log(this._data)
    if(this._data.exam_round_member_id){ 
      this.getCorrectAnswer();
    }
  }
  
  getCorrectAnswer(): void {
    this.loading();
    this._examService.getCorrectAnswer(this._data.exam_round_member_id).subscribe((resp : any) => {
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

  onCloseDialog(){
    this.matDialogRef.close({ status: 'success', exam_round_member_id : this._data.exam_round_member_id });
  }

}

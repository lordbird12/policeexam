import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ExamService } from '../exam.service';
import Swal from 'sweetalert2';
import { HelperFunctionService } from 'app/shared/helper-function.service';
import { Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';

import {
    CalendarOptions,
    DateSelectArg,
    EventClickArg,
    EventApi,
} from '@fullcalendar/core';
// import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import thLocale from '@fullcalendar/core/locales/th';

declare var $: any;
const token = localStorage.getItem('accessToken') || null;

@Component({
    selector: 'app-exam-calendar',
    templateUrl: './exam-calendar.component.html',
    styleUrls: ['./exam-calendar.component.scss'],
})
export class ExamCalendarComponent implements OnInit {
    calendarVisible = true;
    // calendarOptions: CalendarOptions = {};

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: '',
        },
        initialView: 'dayGridMonth',
        locale: thLocale,
    };

    categories: any[];
    courses: any[];
    filteredCourses: any[];
    dataRow: any[];

    showAlert: boolean = false;
    regitExamForm: FormGroup;
    DetailForm: FormGroup;

    dataExam: any;
    dataArrExam = [];
    events: any = [];
    constructor(
        private _authService: AuthService,
        private _examServ: ExamService,
        private helper: HelperFunctionService,
        private rou: Router,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getExamList();
    }

    doExample(ArrData): void {
        // console.log("ArrData", ArrData);
        this.rou.navigate(['/exam/do-exams', ArrData.exam_id]);
    }

    handleCalendarToggle() {
        this.calendarVisible = !this.calendarVisible;
    }

    handleWeekendsToggle() {
        const { calendarOptions } = this;
        calendarOptions.weekends = !calendarOptions.weekends;
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    }

    handleEventClick(clickInfo: EventClickArg) {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            clickInfo.event.remove();
        }
    }

    handleEvents(events: EventApi[]) {
        // this.currentEvents = events;
        // this.changeDetector.detectChanges();
    }

    getExamList(): void {
        this.loading();
        this._examServ.getMyExam().subscribe((resp: any) => {
            console.clear();
            this.dataExam = resp;
            this.events = [];
            for (let i = 0; i <= this.dataExam.data.length - 1; i++) {
                let sendData = {
                    title: this.dataExam.data[i].exam_round.exam.name,
                    date: this.dataExam.data[i].exam_round.exam_date,
                };
                this.events.push(sendData);
                this._changeDetectorRef.markForCheck();
            }

            this.calendarOptions.events = this.events;
            this._changeDetectorRef.markForCheck();

            setTimeout(() => {
                Swal.close();
            }, 500);
        });
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

    onConfirm(info: any) {}
}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { PageService } from 'app/modules/admin/dashboards/member/page.service';
import Swal from 'sweetalert2';
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
import thLocale from '@fullcalendar/core/locales/th';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LandingHomeComponent implements OnInit, OnDestroy {
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
    dataExam: any;
    dataArrExam = [];
    events: any = [];

    data: any;
    user: any;
    selectedProject: string = 'รายการสอบครั้งที่ 1 2565';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // @ViewChild('nav') slider: NgImageSliderComponent;

    // prevImageClick() {
    //     this.slider.prev();
    // }

    // nextImageClick() {
    //     this.slider.next();
    // }

    images = [];
    /**
     * Constructor
     */
    constructor(
        private _Service: PageService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        // Get the data
        this.GetBanners();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    GetBanners(): void {
        this.loading();
        this._Service.getBanners().subscribe((resp) => {
            this.images = resp.data;
            this.GetCalendar();
            this._changeDetectorRef.markForCheck();

            setTimeout(() => {
                Swal.close();
            }, 500);
        });
    }

    GetCalendar(): void {
        this._Service.getCalendar().subscribe((resp) => {
            this.dataExam = resp.data;

            this.events = [];
            for (let i = 0; i <= this.dataExam.length - 1; i++) {
                let sendData = {
                    title: this.dataExam[i].exam.name,
                    date: this.dataExam[i].exam_date,
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
}

import {
    ChangeDetectionStrategy,
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

    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
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

    images = [
        {path: 'https://source.unsplash.com/800x600/?nature'},
        {path: 'https://source.unsplash.com/800x600/?car'},
        {path: 'https://source.unsplash.com/800x600/?moto'},
        {path: 'https://source.unsplash.com/800x600/?fantasy'},
      ]
    /**
     * Constructor
     */
    constructor(private _Service: PageService, private _router: Router) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        // Get the data
        this._Service.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

   
            });

      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


}

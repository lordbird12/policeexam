import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
// import { academyRoutes } from 'app/modules/admin/apps/academy/academy.routing';
// import { AcademyComponent } from 'app/modules/admin/apps/academy/academy.component';
// import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
// import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular';
import { examRoutes } from './exam.routing'
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { FuseCardModule } from '@fuse/components/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamTodoComponent } from './exam-todo/exam-todo.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamCalendarComponent } from './exam-calendar/exam-calendar.component';
import { ExamHistoryComponent } from './exam-history/exam-history.component';
import { CorrectAnswersComponent } from './correct-answers/correct-answers.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogCorrectAnswerComponent } from './dialog-correct-answer/dialog-correct-answer.component';
import { RegiterDialogComponent } from './regiter-dialog/regiter-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
    declarations: [
        ExamComponent,
        ListComponent,
        DetailsComponent,
        ExamTodoComponent,
        ExamCalendarComponent,
        ExamHistoryComponent,
        CorrectAnswersComponent,
        DialogCorrectAnswerComponent,
        RegiterDialogComponent,
        ResetPasswordComponent,
        UserDetailComponent
    ],
    imports: [
        CommonModule,
        // FormsModule,
        // ReactiveFormsModule,
        RouterModule.forChild(examRoutes),
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatTabsModule,
        FuseCardModule,
        FuseAlertModule,
        MatProgressSpinnerModule,
        FullCalendarModule,
        MatDatepickerModule,
        MatRadioModule

    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
        { provide: LOCALE_ID, useValue: 'th-TH' },
    ],
})
export class ExamModule { }

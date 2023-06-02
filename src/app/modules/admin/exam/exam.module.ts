import { NgModule } from '@angular/core';
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
    RegiterDialogComponent
  ],
  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    RouterModule.forChild(examRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
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
    MatSelectModule,
    MatAutocompleteModule,
  ]
})
export class ExamModule { }

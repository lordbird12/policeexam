import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
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
import { pageRoutes } from './page.routing'
import { ListComponent } from './list/list.component';
import { FuseCardModule } from '@fuse/components/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    PageComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    RouterModule.forChild(pageRoutes),
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
    MatAutocompleteModule
  ]
})
export class PageModule { }

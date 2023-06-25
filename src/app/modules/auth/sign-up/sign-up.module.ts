import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID  } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { authSignupRoutes } from 'app/modules/auth/sign-up/sign-up.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IdCardFormatPipe } from 'app/id-card-format.pipe';

@NgModule({
    declarations: [AuthSignUpComponent,IdCardFormatPipe],
    imports: [
        RouterModule.forChild(authSignupRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule,
    ],

    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
        { provide: LOCALE_ID, useValue: 'th-TH' },
    ],
})
export class AuthSignUpModule {}

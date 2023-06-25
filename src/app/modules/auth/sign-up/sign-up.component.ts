import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: FormGroup;
    signUpForm2: FormGroup;
    showAlert: boolean = false;
    options: string[] = ['One', 'Two', 'Three'];
    //agency command
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

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.dayOptions = Array.from({ length: 31 }, (_, index) => index + 1);
        this.monthOptions =
            Array.from({ length: 12 }, (_, index) => index + 1);


        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 60;
        this.yearOptions = Array.from({ length: 61 }, (_, index) => startYear + index + 543); // Add 543 to convert to B.E.

      }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
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
            type: ['police'],
        });

        this.signUpForm2 = this._formBuilder.group({
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
            type: ['normal'],
            file_citizen: [''],
            address: [''],
            address_of_citizen: [''],
        });

        this.GetAgencyCommand();
        this.GetPosition();
        this.GetPrefixType();

        this.filteredPrefixType = this.PrefixTypeId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPrefixType(value || ''))
        );

        this.filteredPrefix = this.PrefixId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPrefix(value || ''))
        );

        this.filteredAgencyCommand = this.AgencyCommandId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterAgencyComand(value || ''))
        );

        this.filteredSubAgencyCommand =
            this.SubAgencyCommandId.valueChanges.pipe(
                startWith(''),
                map((value) => this._filterSubAgencyComand(value || ''))
            );

        this.filteredAffiliation = this.AffiliationId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterAffiliation(value || ''))
        );

        this.filteredPosition = this.PositionId.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterPosition(value || ''))
        );
    }

    displayPrefixType(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.prefixtypeData.findIndex(
            (state) => state.prefix_type_id === subject
        );

        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                prefix_type_id: this.prefixtypeData[index].prefix_type_id,
            });
        } else {
            this.signUpForm2.patchValue({
                prefix_type_id: this.prefixtypeData[index].prefix_type_id,
            });
        }
        return this.prefixtypeData[index].name;
    }

    displayPrefix(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.prefixData.findIndex(
            (state) => state.prefix_id === subject
        );
        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                prefix_id: this.prefixData[index].prefix_id,
                sex: this.prefixData[index].sex
            });
        } else {
            this.signUpForm2.patchValue({
                prefix_id: this.prefixData[index].prefix_id,
                sex: this.prefixData[index].sex
            });
        }
        return this.prefixData[index].sub_name;
    }

    displayAgencyCommand(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.acmData.findIndex(
            (state) => state.agency_command_id === subject
        );

        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                agency_command_id: this.acmData[index].agency_command_id,
            });
        } else {
            this.signUpForm2.patchValue({
                agency_command_id: this.acmData[index].agency_command_id,
            });
        }

        return this.acmData[index].name;
    }

    displaySubAgencyCommand(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.subagencycommandData.findIndex(
            (state) => state.sub_agency_command_id === subject
        );

        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                sub_agency_command_id:
                    this.subagencycommandData[index].sub_agency_command_id,
            });
        } else {
            this.signUpForm2.patchValue({
                sub_agency_command_id:
                    this.subagencycommandData[index].sub_agency_command_id,
            });
        }

        return this.subagencycommandData[index].name;
    }

    displayAffiliation(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.affiliationData.findIndex(
            (state) => state.affiliation_id === subject
        );
        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                affiliation_id: this.affiliationData[index].affiliation_id,
            });
        } else {
            this.signUpForm2.patchValue({
                affiliation_id: this.affiliationData[index].affiliation_id,
            });
        }

        return this.affiliationData[index].name;
    }

    displayPosition(subject) {
        // return subject ? subject.province : undefined;
        if (!subject) return '';
        let index = this.positionData.findIndex(
            (state) => state.position_id === subject
        );

        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                position_id: this.positionData[index].position_id,
            });
        } else {
            this.signUpForm2.patchValue({
                position_id: this.positionData[index].position_id,
            });
        }
        return this.positionData[index].name;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    private _filterAgencyComand(value: string): string[] {
        const filterValue = value.toLowerCase();
        this.GetSubAgencyCommand(filterValue);
        return this.acmData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterPrefixType(value: string): string[] {
        const filterValue = value.toLowerCase();
        this.GetPrefix(filterValue);
        return this.prefixtypeData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterPrefix(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.prefixData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterSubAgencyComand(value: string): string[] {
        const filterValue = value.toLowerCase();
        this.GetAffiliation(filterValue);
        return this.subagencycommandData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterAffiliation(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.affiliationData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filterPosition(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.positionData.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.subagencycommandData.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    changeType(status: number): void {
        console.log(status)
        this.userTypeSelect = status;


        this._changeDetectorRef.markForCheck();
    }

    handleFileInputChange(l: FileList): void {
        this.file_store = l;
        if (l.length) {
            const f = l[0];
            const count = l.length > 1 ? `(+${l.length - 1} files)` : '';
            this.signUpForm2.patchValue({
                file_citizen: f.name
            });
        } else {
            this.signUpForm2.patchValue({
                file_citizen: ''
            });
        }
    }

    handleSubmit(): void {
        var fd = new FormData();
        this.file_list = [];
        for (let i = 0; i < this.file_store.length; i++) {
            fd.append('files', this.file_store[i], this.file_store[i].name);
            this.file_list.push(this.file_store[i].name);
        }

        // do submit ajax
    }

    upload(event: Event) {
        console.log(event);
    }

    selectFile(event) {
        // this.selectedFiles = event.target.files;
    }

    openInput() {
        document.getElementById('fileInput').click();
    }

    uploadFile(event) {
        let reader = new FileReader(); // HTML5 FileReader API
        let file = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(file);

            // When file uploads set it to file formcontrol
            reader.onload = () => {
                this.imageUrl = reader.result;
                if (this.userTypeSelect === 1) {
                    this.signUpForm.patchValue({
                        image: reader.result,
                    });
                    this.editFile = false;
                    this.removeUpload = true;
                } else {
                    this.signUpForm2.patchValue({
                        image: reader.result,
                    });
                    this.editFile = false;
                    this.removeUpload = true;
                }
            };
            // ChangeDetectorRef since file is loading outside the zone
            this._changeDetectorRef.markForCheck();
        }
    }

    onChange(event: any): void {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) =>
            this.imageUrl = e.target.result;
        const file = event.target.files[0];
        if (this.userTypeSelect === 1) {
            this.signUpForm.patchValue({
                image: file,
            });
            this.editFile = false;
            this.removeUpload = true;
        } else {
            this.signUpForm2.patchValue({
                image: file,
            });
            this.editFile = false;
            this.removeUpload = true;
        }

    }

    // Function to remove uploaded file
    removeUploadedFile() {
        this.imageUrl =
            'assets/images/no_pic.png';
        this.editFile = true;
        this.removeUpload = false;
        this.signUpForm.patchValue({
            file: [null],
        });
    }

    onSubmit() {
        // this.submitted = true;
        if (!this.signUpForm.valid) {
            alert(
                'Please fill all the required fields to create a super hero!'
            );
            return false;
        } else {
            console.log(this.signUpForm.value);
        }
    }

    GetAgencyCommand(): void {
        this._authService.getAgencyCommand().subscribe((resp) => {
            this.acmData = resp.data;
            this.acmFilter = this.acmData;
        });
    }

    GetSubAgencyCommand(id): void {
        this._authService.getSubAgencyCommand(id).subscribe((resp) => {
            this.subagencycommandData = resp.data;
            this.subagencycommandFilter = this.subagencycommandData;
            console.log('subagen', this.subagencycommandData)
        });
    }

    GetAffiliation(id): void {
        this._authService.getAffiliation(id).subscribe((resp) => {
            this.affiliationData = resp.data;
        });
    }

    GetPosition(): void {
        this._authService.getPosition().subscribe((resp) => {
            this.positionData = resp.data;
        });
    }

    GetPrefixType(): void {
        this._authService.getPrefixType().subscribe((resp) => {
            this.prefixtypeData = resp.data;
        });
    }

    GetPrefix(id): void {
        this._authService.getPrefix(id).subscribe((resp) => {
            this.prefixData = resp.data;
        });
        console.log(this.prefixData)
    }

    /**
 * Sign up
 */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        //convert date
        this.signUpForm.patchValue({
            birth_date: moment(this.signUpForm.value.birth_date).format(
                'YYYY-MM-DD'
            ),
        });

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;
        const formData = new FormData();
        Object.entries(this.signUpForm.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );

        // Sign up
        this._authService.signUp(formData).subscribe(
            (response) => {
                // Navigate to the confirmation required page
                const confirmation = this._fuseConfirmationService.open({
                    title: 'การลงทะเบียนสำเร็จ',
                    message: response.message,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:badge-check',
                        color: 'success',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'กลับสู่หน้าเข้าสู่ระบบ',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });

                confirmation.afterClosed().subscribe((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        this._router.navigateByUrl('/sign-in');
                    }
                });
            },
            (response) => {


                // Set the alert
                // this.alert = {
                //     type: 'error',
                //     message: response.message,
                // };

                const confirmation = this._fuseConfirmationService.open({
                    title: 'การลงทะเบียนไม่สำเร็จ',
                    message: response.error.message,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:x-circle',
                        color: 'error',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'กลับสู่หน้าเข้าสู่ระบบ',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });
                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                this.signUpNgForm.resetForm();
                // Show the alert
                this.showAlert = true;
            }
        );
    }

    signUp2(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm2.value.invalid) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'การลงทะเบียนไม่สำเร็จ',
                message: 'กรุณาระบุข้อมูลให้ครบถ้วน ',
                icon: {
                    show: true,
                    name: 'heroicons_outline:x-circle',
                    color: 'error',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'กลับสู่หน้าเข้าสู่ระบบ',
                        color: 'primary',
                    },
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });
            return;
        }

        //convert date
        this.signUpForm2.patchValue({
            birth_date: moment(this.signUpForm2.value.birth_date).format(
                'YYYY-MM-DD'
            ),
        });

        // Disable the form
        this.signUpForm2.disable();

        // Hide the alert
        this.showAlert = false;

        const formData = new FormData();
        Object.entries(this.signUpForm2.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );

        this.file_list = [];
        for (let i = 0; i < this.file_store.length; i++) {
            formData.append('file_citizen', this.file_store[i], this.file_store[i].name);
            this.file_list.push(this.file_store[i].name);
        }


        // Sign up
        this._authService.signUp(formData).subscribe(
            (response) => {
                // Navigate to the confirmation required page

                const confirmation = this._fuseConfirmationService.open({
                    title: 'การลงทะเบียนสำเร็จ',
                    message: response.message,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:badge-check',
                        color: 'success',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'กลับสู่หน้าเข้าสู่ระบบ',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });

                confirmation.afterClosed().subscribe((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        this._router.navigateByUrl('/sign-in');
                    }
                });
            },
            (response) => {
                // // Re-enable the form
                // this.signUpForm.enable();

                // // Reset the form
                // this.signUpNgForm.resetForm();

                // // Set the alert
                // this.alert = {
                //     type: 'error',
                //     message: 'Something went wrong, please try again.',
                // };

                // // Show the alert
                // this.showAlert = true;

                const confirmation = this._fuseConfirmationService.open({
                    title: 'การลงทะเบียนไม่สำเร็จ',
                    message: response.error.message,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:x-circle',
                        color: 'error',
                    },
                    actions: {
                        confirm: {
                            show: true,
                            label: 'กลับสู่หน้าเข้าสู่ระบบ',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });
                // Re-enable the form
                this.signUpForm2.enable();

                // Reset the form
                this.signUpNgForm.resetForm();
                // Show the alert
                this.showAlert = true;
            }
        );
    }


    onChangeSex(event): void {
        // console.log(event)
        const sexdata = this.prefixData.find(item => item.prefix_id === event)
        this.signUpForm.patchValue({
            sex: sexdata.sex
        })
    }

    onChangeSubAgencyCommand(id: string): void {
        console.log(id, 'id ')
    this.GetSubAgencyCommand(id);
    }
    onChangeAffiliation(id: string): void {
        console.log(id, 'id ')
    this.GetAffiliation(id);
    }
    onChangePrefix(id: string): void {
        console.log(id, 'id ')
    this.GetPrefix(id);
    }


}

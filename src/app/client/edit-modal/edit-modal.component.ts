import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { catchError, generate } from 'rxjs';
import { clientDetailedWrite } from '../../dto/client/ClientListDto';
import { DistrictDto, StateDto } from '../../dto/places/placesDto';
import { BusinessType } from '../../dto/utility/BusinessTypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientDtoService } from '../../services/client-dto.service';
import { ToastrService } from 'ngx-toastr';
import { state } from '@angular/animations';


@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent implements OnChanges, OnInit {
  @Input() clientId!: number
  dto!: clientDetailedWrite
  states: StateDto[] = []
  districts: DistrictDto[] = []
  businessTypes: BusinessType[] = []
  clientForm!: FormGroup
  dataSubmitting = false;
  showITForm = false;
  showGSTForm = false;


  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private clientDtoService: ClientDtoService) {
    this.buildClientForm();
  }

  ngOnChanges(): void {
    this.getClientDetails();
  }

  ngOnInit(): void {
    this.getStates();
  }


  buildClientForm(): void {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      middleName: ['', Validators.maxLength(25)],
      lastName: ['', Validators.maxLength(25)],
      fatherName: ['', Validators.maxLength(40)],
      dob: [''],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      aadhaar: ['', Validators.pattern('^\\d{12}$')],
      pan: ['', [Validators.required, Validators.pattern('^[A-Za-z]{5}\\d{4}[A-Za-z]{1}$')]],
      panadhrLink: [false],
      business: ['', Validators.required],
      state: ['36', Validators.required],
      addr1: ['', Validators.maxLength(25)],
      addr2: ['', Validators.maxLength(25)],
      po: ['', Validators.maxLength(35)],
      pin: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      ps: [''],
      dist: ['696', Validators.required],
      clientType: ['', Validators.required],
      it: this.fb.group({
        itType: [{ value: '', disabled: !this.showITForm }, Validators.required],
        itPassword: [{ value: '', disabled: !this.showITForm }, [Validators.required, Validators.maxLength(50)]],
        itFileNo: [{ value: '', disabled: !this.showITForm }, Validators.maxLength(25)],
      }),
      gst: this.fb.group({
        gstType: [{ value: '', disabled: !this.showGSTForm }, Validators.required],
        auditable: [{ value: '', disabled: !this.showGSTForm }],
        gstNumber: [{ value: '', disabled: !this.showGSTForm }, [Validators.required, Validators.pattern('\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}')]],
        gstregDate: [{ value: '', disabled: !this.showGSTForm }, Validators.required],
        gstUserName: [{ value: '', disabled: !this.showGSTForm }, [Validators.required, Validators.maxLength(50)]],
        gstPassword: [{ value: '', disabled: !this.showGSTForm }, [Validators.required, Validators.maxLength(50)]],
        gstFileNo: [{ value: '', disabled: !this.showGSTForm }, Validators.maxLength(25)]
      })
    })
  }


  getDistricts(stateId: number): void {
    this.httpService.get(`utility/state/${stateId}/districts`)
      .pipe(
        catchError(error => {
          console.error(error);
          throw error;
        })
      )
      .subscribe(
        (res: any) => {
          this.districts = res;
        }
      )
      .add()
  }

  getStates(): void {
    this.httpService.get("utility/client-add-init-data")
      .pipe(
        catchError(error => {
          console.error(error);
          throw error;
        })
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.states = res.states;
          this.businessTypes = res.businessTypes;
          this.districts = res.districts;
        }
      )
      .add()
  }

  getClientDetails(): void {
    if (this.clientId > 0) {
      this.httpService.get(`clients/${this.clientId}`)
        .pipe(
          catchError(error => {
            console.log(error);
            throw error;
          })
        )
        .subscribe((res: any) => {
          this.dto = res;
          console.log(this.dto);
          this.clientForm.patchValue({
            id: this.dto.id,
            firstName: this.dto.fname,
            middleName: this.dto.mname,
            lastName: this.dto.lname,
            fatherName: this.dto.father,
            dob: this.dto.dob,
            gender: this.dto.gender,
            mobile: this.dto.mob1,
            email: this.dto.email,
            password: this.dto.password,
            aadhaar: this.dto.aadhaar,
            pan: this.dto.pan,
            panadhrLink: this.dto.panadhrLink,
            business: this.dto.business,
            state: this.dto.state,
            add1: this.dto.addr1,
            addr2: this.dto.addr2,
            po: this.dto.po,
            pin: this.dto.pin,
            ps: this.dto.ps,
            dist: this.dto.dist,
            clientType: this.dto.clType
          })
          if (this.dto.clType == 0 || this.dto.clType == 2) {
            this.clientForm.patchValue({
              gst: {
                gstType: this.dto.gstType,
                auditable: this.dto.gstAuditNoAudit,
                gstNumber: this.dto.gstNumber,
                gstregDate: this.dto.gstRegisDate,
                gstUserName: this.dto.gstUserName,
                gstPassword: this.dto.gstPassword,
                gstFileNo: this.dto.gstFileNo
              }
            })
          } else if (this.dto.clType == 1 || this.dto.clType == 2) {
            this.clientForm.patchValue({
              it: {
                itType: this.dto.auditNoAuditIT,
                itPassword: this.dto.passwordIt,
                itFileNo: this.dto.fileNoIt
              }
            })
          }
        })
        .add()
    }

  }
}

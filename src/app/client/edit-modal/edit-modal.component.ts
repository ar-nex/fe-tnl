import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { catchError} from 'rxjs';
import { clientDetailedWrite } from '../../dto/client/ClientListDto';
import { DistrictDto, StateDto } from '../../dto/places/placesDto';
import { BusinessType } from '../../dto/utility/BusinessTypes';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientDtoService } from '../../services/client-dto.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { updateGstClientDto, updateItandGstClientDto, updateItClientDto } from '../../dto/client/ClientDTO';


@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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

  isPanDuplicate = false;
  isAadhaarDuplicate = false;
  isGstNoDuplicate = false;
  isGstUserNameDuplicate = false;

  @Output() updatedDto = new EventEmitter<clientDetailedWrite>();
  @ViewChild('closeEditModal', {static: false}) closeEditModal! : ElementRef

  clientTypes = [
    {id: 1, name : "IT"},
    {id: 0, name : "GST"},
    {id: 2, name : "IT & GST (both)"},
  ]


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
    this.clientForm.get('clientType')!.valueChanges.subscribe(value => {
      this.showHideFormGroups(value);
    });
    this.clientForm.get('state')!.valueChanges.subscribe(value => {
      if(value > 0){this.getDistricts(value);}
    })
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

  
  showHideFormGroups(clientType: string) {
    switch (clientType) {
      case '1':
        this.showITForm = true;
        this.showGSTForm = false;
        this.enableFormGroup('it');
        this.disableFormGroup('gst');
        break;
      case '0':
        this.showITForm = false;
        this.showGSTForm = true;
        this.enableFormGroup('gst');
        this.disableFormGroup('it');
        break;
      case '2':
        this.showITForm = true;
        this.showGSTForm = true;
        this.enableFormGroup('it');
        this.enableFormGroup('gst');
        break;
      default:
        this.showITForm = false;
        this.showGSTForm = false;
        this.disableFormGroup('it');
        this.disableFormGroup('gst');
    }
  }
  
  enableFormGroup(groupName: string) {
    const group = this.clientForm.get(groupName) as FormGroup;
    Object.keys(group!.controls).forEach(controlName => {
      group!.get(controlName)!.enable();
    });
  }
  
  disableFormGroup(groupName: string) {
    const group = this.clientForm.get(groupName) as FormGroup;
    Object.keys(group!.controls).forEach(controlName => {
      group!.get(controlName)!.disable();
    });
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
          this.patchClientFormValues(this.dto);
          this.handleClientType(this.dto.clType);
        })
        .add()
    }
  }
  
  private patchClientFormValues(dto: clientDetailedWrite): void {
    this.clientForm.patchValue({
      id: dto.id,
      firstName: dto.fname,
      middleName: dto.mname == null ? "" : dto.mname,
      lastName: dto.lname == null ? "" : dto.lname,
      fatherName: dto.father == null ? "" : dto.father,
      dob: dto.dob,
      gender: dto.gender,
      mobile: dto.mob1,
      email: dto.email,
      password: dto.password,
      aadhaar: dto.aadhaar == null ? "" : dto.aadhaar,
      pan: dto.pan,
      panadhrLink: dto.panadhrLink,
      business: dto.businessId,
      state: dto.stateId,
      add1: dto.addr1 == null ? "" : dto.addr1,
      addr2: dto.addr2 == null ? "" : dto.addr2,
      po: dto.po == null ? "" : dto.po,
      pin: dto.pin == null ? "" : dto.pin,
      ps: dto.ps == null ? "" : dto.ps,
      dist: dto.distId,
      clientType: dto.clType
    });
  }
  
  private handleClientType(clientType: number): void {
    switch (clientType) {
      case 0:
        this.showGSTForm = true;
        this.enableFormGroup('gst');
        this.clientTypes = this.clientTypes.filter(type => type.id !== 1);
        this.patchGSTFormValues(this.dto);
        break;
      case 1:
        this.showITForm = true;
        this.enableFormGroup('it');
        this.clientTypes = this.clientTypes.filter(type => type.id !== 0);
        this.patchITFormValues(this.dto);
        break;
      case 2:
        this.clientForm.get('clientType')!.disable();
        this.showITForm = true;
        this.enableFormGroup('it');
        this.showGSTForm = true;
        this.enableFormGroup('gst');
        this.patchITFormValues(this.dto);
        this.patchGSTFormValues(this.dto);
        break;
    }
  }
  
  private patchGSTFormValues(dto: clientDetailedWrite): void {
    this.clientForm.patchValue({
      gst: {
        gstType: dto.gstType == null ? "" : dto.gstType,
        auditable: dto.gstAuditNoAudit == null ? "" : dto.gstAuditNoAudit,
        gstNumber: dto.gstNumber,
        gstregDate: dto.gstRegisDate,
        gstUserName: dto.gstUserName,
        gstPassword: dto.gstPassword,
        gstFileNo: dto.gstFileNo == null ? "" : dto.gstFileNo
      }
    });
  }
  
  private patchITFormValues(dto: clientDetailedWrite): void {
    this.clientForm.patchValue({
      it: {
        itType: dto.auditNoAuditIT == null ? "" : dto.auditNoAuditIT,
        itPassword: dto.passwordIt == null ? "" : dto.passwordIt,
        itFileNo: dto.fileNoIt == null ? "" : dto.fileNoIt
      }
    });
  }

  onSubmit():void{
    if (this.clientForm.valid) {
      let cltype = this.clientForm.get('clientType')?.value;
      if(cltype == '1'){
        const itdto: updateItClientDto = {
          ...this.clientDtoService.generateItClientDto(this.clientForm),
          id: this.clientId
        }
        this.putClientData("clients/it", itdto);
      }else if(cltype == 0){
        const gstdto: updateGstClientDto = {
          ...this.clientDtoService.generateGstClientDto(this.clientForm),
          id: this.clientId
        }
        this.putClientData("clients/gst", gstdto);
      }else if(cltype == 2){
        const gstitdto : updateItandGstClientDto = {
          ...this.clientDtoService.generateITGstClientDto(this.clientForm),
          id: this.clientId
        }
        this.putClientData("clients/gst", gstitdto);
      }
    }
  }


  putClientData(urlseg: string, payload: any):void{
    this.dataSubmitting = true;
    this.httpService.put(urlseg, payload)
    .pipe(
      catchError(error => {
        console.error(error);
        if (error.error?.duplicates) {
          console.error('Duplicate errors:', error.error.duplicates);
          this.toastr.error('Duplicate errors:', error.error.duplicates);
          let dups = error.error.duplicates;
          if(dups.includes("PAN")){
            this.isPanDuplicate = true;
          }
          if(dups.includes("AADHAAR")){
            this.isAadhaarDuplicate = true;
          }
          if(dups.includes("GST NUMBER")){
            this.isGstNoDuplicate = true;
          }
          if(dups.includes("GST USER NAME")){
            this.isGstUserNameDuplicate = true;
          }
          
        }else{
          this.toastr.error('Error:', error.error);
        }
        this.dataSubmitting = false;
        throw error;
      })
    )
    .subscribe(
      (res: any)=>{
        console.log(res);
        this.toastr.success("Client added successfully.");

        this.isPanDuplicate = false;
        this.isAadhaarDuplicate = false;
        this.isGstNoDuplicate = false;
        this.isGstUserNameDuplicate = false;

        this.closeEditModal.nativeElement.click();
        this.dataSubmitting = false;
        this.updatedDto.emit(payload);
      }
    )
    .add(
      () => {this.dataSubmitting = false;}
    )
  }

}

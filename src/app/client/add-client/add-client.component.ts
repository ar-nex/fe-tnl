import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashLayoutComponent } from '../../dash-layout/dash-layout.component';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DistrictDto, StateDto } from '../../dto/places/placesDto';
import { catchError } from 'rxjs';
import { BusinessType } from '../../dto/utility/BusinessTypes';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ClientDtoService } from '../../services/client-dto.service';
import { clientDto } from '../../dto/client/ClientDTO';
import { AddedClientListComponent } from "../added-client-list/added-client-list.component";


@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [DashLayoutComponent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule, AddedClientListComponent],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css'
})
export class AddClientComponent implements OnInit {
  @ViewChild('closeBtn', { static: true }) closeModal!: ElementRef;
  states: StateDto[] = []
  districts: DistrictDto[] = []
  businessTypes: BusinessType[] = []
  newBusiness: string = "";
  newBusinessAdding = false;
  clientForm!: FormGroup
  dataSubmitting = false;
  showITForm = false;
  showGSTForm = false;
  addedClientList: clientDto[] = []

  isPanDuplicate = false;
  isAadhaarDuplicate = false;
  isGstNoDuplicate = false;
  isGstUserNameDuplicate = false;

  /**
   *
   */
  constructor(private httpService: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private clientDtoService: ClientDtoService) {
    this.buildClientForm();
  }

  ngOnInit(): void {
    this.getStates();
    this.clientForm.get('clientType')!.valueChanges.subscribe(value => {
      this.showHideFormGroups(value);
    });
    this.clientForm.get('state')!.valueChanges.subscribe(value => {
      this.getDistricts(value);
    })
    this.clientForm.get('pan')!.valueChanges.subscribe(() => {
      this.isPanDuplicate = false;
    });
    this.clientForm.get('aadhaar')!.valueChanges.subscribe(() => {
      this.isAadhaarDuplicate = false;
    });
    this.clientForm.get('gst.gstNumber')!.valueChanges.subscribe(() => {
      this.isGstNoDuplicate = false;
    });
    this.clientForm.get('gst.gstUserName')!.valueChanges.subscribe(() => {
      this.isGstUserNameDuplicate = false;
    });
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
      panadhrLink:[false],
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
        itType: [{value: '', disabled: !this.showITForm}, Validators.required],
        itPassword: [{value: '', disabled: !this.showITForm}, [Validators.required, Validators.maxLength(50)]],
        itFileNo: [{value: '', disabled: !this.showITForm}, Validators.maxLength(25)],
      }),
      gst: this.fb.group({
        gstType: [{value: '', disabled: !this.showGSTForm}, Validators.required],
        auditable: [{value: '', disabled: !this.showGSTForm}],
        gstNumber: [{value: '', disabled: !this.showGSTForm}, [Validators.required, Validators.pattern('\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}')]],
        gstregDate: [{value: '', disabled: !this.showGSTForm}, Validators.required],
        gstUserName: [{value: '', disabled: !this.showGSTForm}, [Validators.required, Validators.maxLength(50)]],
        gstPassword: [{value: '', disabled: !this.showGSTForm}, [Validators.required, Validators.maxLength(50)]],
        gstFileNo: [{value: '', disabled: !this.showGSTForm}, Validators.maxLength(25)]
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

  getDistricts(stateId: number):void{
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

  addNewBusiness(): void {
    if (this.newBusiness.length < 2 || this.newBusiness.length > 50) {
      this.toastr.error("Invalid business name.");
      return;
    }
    const btnew: BusinessType = {
      id: 0,
      name: this.newBusiness
    }
    this.newBusinessAdding = true;
    console.log(btnew);
    this.httpService.post("business", btnew)
      .pipe(
        catchError(error => {
          console.log(error);
          this.toastr.error("Failed to add business");
          this.newBusinessAdding = false;
          throw error;
        })
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          btnew.id = res;
          this.businessTypes.push(btnew);
          this.closeModal.nativeElement.click();
        })
      .add(
        () => {
          this.newBusinessAdding = false;
        }
      )
  }

  onSubmit() {
    if (this.clientForm.valid) {
      let cltype = this.clientForm.get('clientType')?.value;
      if(cltype == '1'){
        const itdto = this.clientDtoService.generateItClientDto(this.clientForm);
      //  let d = JSON.stringify(itdto)
      //  console.log(d);
        this.postClientData("clients/it", itdto);
      }else if(cltype == "0"){
        const gstdto = this.clientDtoService.generateGstClientDto(this.clientForm);
        // console.log(gstdto);
       // console.log(JSON.stringify(gstdto))
        this.postClientData("clients/gst", gstdto);
      }else if(cltype == "2"){
        const itgstdto = this.clientDtoService.generateITGstClientDto(this.clientForm);
        console.log(itgstdto);
        this.postClientData("clients/gst-it", itgstdto);
      }else{
        this.toastr.error("Invalid client type");
      }
    } else {
      this.validateAllFormFields(this.clientForm);
      let cltype = this.clientForm.get('clientType')?.value;
      console.log(cltype);
    }
  }

  postClientData(urlseg: string, payload: any):void{
    this.dataSubmitting = true;
    this.httpService.post(urlseg, payload)
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
        this.addedClientList.unshift(this.clientDtoService.generateClientDto(this.clientForm));
        this.toastr.success("Client added successfully.");
        this.dataSubmitting = false;
        this.resetClientForm();
      }
    )
    .add(
      () => {this.dataSubmitting = false;}
    )
  }
  

  resetClientForm(): void {
    this.clientForm.reset();
    this.showITForm = false;
    this.showGSTForm = false;
    this.disableFormGroup('it');
    this.disableFormGroup('gst');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control!.markAsTouched({onlySelf: true});
      }
    });
  }

}

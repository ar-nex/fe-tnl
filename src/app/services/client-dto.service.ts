// client-dto.service.ts
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { clientDto, gstClientDto, ITandGstClientDto, itClientDto } from '../dto/client/ClientDTO';


@Injectable({
  providedIn: 'root'
})
export class ClientDtoService {

  constructor() { }

  getCommonFields(formGroup: FormGroup): any {
    return {
      aadhaar: formGroup.get('aadhaar')?.value == "" ? null : formGroup.get('aadhaar')?.value,
      fname: formGroup.get('firstName')?.value.toUpperCase(),
      mname: formGroup.get('middleName')?.value == "" || formGroup.get('middleName')?.value == null ? null : formGroup.get('middleName')?.value.toUpperCase(),
      lname: formGroup.get('lastName')?.value == "" ? null : formGroup.get('lastName')?.value.toUpperCase(),
      father: formGroup.get('fatherName')?.value == "" ? null : formGroup.get('fatherName')?.value.toUpperCase(),
      dob: formGroup.get('dob')?.value == "" ? null : formGroup.get('dob')?.value,
      gender: formGroup.get('gender')?.value,
      email: formGroup.get('email')?.value == ""? null : formGroup.get('email')?.value,
      password: formGroup.get('password')?.value == "" ? null : formGroup.get('password')?.value,
      mob1: formGroup.get('mobile')?.value == "" ? null : formGroup.get('mobile')?.value,
      addr1: formGroup.get('addr1')?.value == "" ? null : formGroup.get('addr1')?.value.toUpperCase(),
      addr2: formGroup.get('addr2')?.value == "" ? null : formGroup.get('addr2')?.value.toUpperCase(),
      po: formGroup.get('po')?.value == "" ? null : formGroup.get('po')?.value.toUpperCase(),
      ps: formGroup.get('ps')?.value == "" ? null : formGroup.get('ps')?.value,
      pin: formGroup.get('pin')?.value,

      distId: formGroup.get('dist')?.value,
      pan: formGroup.get('pan')?.value.toUpperCase(),
      clType: formGroup.get('clientType')?.value == "" ? null : Number(formGroup.get('clientType')?.value),
      businessTypeId: formGroup.get('business')?.value,
      panadhrLink: formGroup.get('panadhrLink')?.value,
    };
  }

  generateClientDto(formGroup: FormGroup): clientDto{
    const commonFields = this.getCommonFields(formGroup);
    return commonFields;
  }
  generateItClientDto(formGroup: FormGroup): itClientDto {
    let dto: itClientDto = {
      ...this.getCommonFields(formGroup),
      passwordIt: formGroup.get('it.itPassword')?.value,
      auditNoAudit: formGroup.get('it.itType')?.value == "" ? null : formGroup.get('it.itType')?.value,
      fileNoIt: formGroup.get('it.itFileNo')?.value == "" ? null : formGroup.get('it.itFileNo')?.value.toUpperCase(),
    }
    return dto;
  }

  generateGstClientDto(formGroup: FormGroup): gstClientDto {
    let dto: gstClientDto = {
      ...this.getCommonFields(formGroup),
      gstUserName: formGroup.get('gst.gstUserName')?.value,
      gstPassword: formGroup.get('gst.gstPassword')?.value,
      gstType: formGroup.get('gst.gstType')?.value,

      gstNumber: formGroup.get('gst.gstNumber')?.value,
      gstRegisDate: formGroup.get('gst.gstregDate')?.value,
      gstFileNo: formGroup.get('gst.gstFileNo')?.value.toUpperCase(),
      GstAuditNoAudit: formGroup.get('gst.auditable')?.value,
    }
    return dto;
  }

  generateITGstClientDto(formGroup: FormGroup): ITandGstClientDto {
    let dto: ITandGstClientDto = {
      ...this.getCommonFields(formGroup),
      gstUserName: formGroup.get('gst.gstUserName')?.value,
      gstPassword: formGroup.get('gst.gstPassword')?.value,
      gstType: formGroup.get('gst.gstType')?.value,

      gstNumber: formGroup.get('gst.gstNumber')?.value,
      gstRegisDate: formGroup.get('gst.gstregDate')?.value,
      gstFileNo: formGroup.get('gst.gstFileNo')?.value.toUpperCase(),
      GstAuditNoAudit: formGroup.get('gst.auditable')?.value,

      passwordIt: formGroup.get('it.itPassword')?.value,
      auditNoAudIt: formGroup.get('it.itType')?.value,
      fileNoIt: formGroup.get('it.itFileNo')?.value.toUpperCase(),
    }
    return dto;
  }

}
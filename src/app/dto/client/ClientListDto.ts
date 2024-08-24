export interface ClientBase {
    id: number;
    fname: string;
    mname: string | null;
    lname: string | null;
    father: string | null;
    email: string;
    password: string;
    mob1: string;
    aadhaar: string | null;
    pan: string;
    clType: number;
    isActive: boolean;
  }
  
  export interface GstDtoRead extends ClientBase {
    gstId: number;
    gstUserName: string;
    gstPassword: string;
    gstNumber: string;
    gstRegisDate: Date;
    gstFileNo: string | null;
  }
  
  export interface ItDtoRead extends ClientBase {
    itId: number;
    passwordIt: string;
    fileNoIt: string | null;
  }
  
  export interface ItGstDtoRead extends ClientBase {
    itId: number;
    passwordIt: string;
    fileNoIt: string | null;
    gstId: number;
    gstUserName: string;
    gstPassword: string;
    gstNumber: string;
    gstRegisDate: Date;
    gstFileNo: string | null;
  }

  export interface clientDetailRead extends ItGstDtoRead{
    dob: Date | null
    gender: string | null
    business : string | null
    gstType: string | null
    gstAuditNoAudit: string | null
    auditNoAuditIT: string | null
    addr1: string | null
    addr2: string | null
    po: string| null
    ps: string | null
    pin: string | null
    dist: string | null
    state: string | null
  }

  export interface clientDetailedWrite extends clientDetailRead{
    id: number,
    panadhrLink: boolean
  }
export interface clientDto{
    fname: string,
    mname: string,
    lname: string,
    dob: Date,
    gender: string,
    father: string,
    email: string,
    password: string,
    mob1: string,
    addr1: string,
    addr2: string,
    po: string,
    ps: string,
    pin: string,
    distId: number,
    aadhaar: string,
    pan: string,
    clType: number,
    businessTypeId: number,
    panadhrLink: boolean
}

export interface updateClientDto extends clientDto{
    id: number
}

export interface itClientDto extends clientDto{
    passwordIt: string,
    auditNoAudit: string,
    fileNoIt: string
}

export interface updateItClientDto extends itClientDto{
    id: number
}

export interface gstClientDto extends clientDto{
    gstUserName: string,
    gstPassword: string,
    gstType: string,
    gstNumber: string,
    gstRegisDate: Date,
    gstFileNo: string,
    GstAuditNoAudit: string
}

export interface updateGstClientDto extends gstClientDto{
    id: number
}


export interface ITandGstClientDto extends gstClientDto{
    passwordIt: string,
    auditNoAudIt: string,
    fileNoIt: string
}

export interface updateItandGstClientDto extends ITandGstClientDto{
    id:number
}
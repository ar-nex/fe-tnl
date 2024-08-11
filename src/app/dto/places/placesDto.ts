export interface StateDto {
    id: number,
    name: string,
    code: string
}

export interface DistrictDto{
    id: number,
    name: string,
    stateId: number
}
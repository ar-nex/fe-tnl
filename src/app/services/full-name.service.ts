import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullNameService {

  constructor() { }

  getFullName(firstName: string, middleName: string | null, lastName: string | null): string {
    let fullName = '';
  
    if (firstName) {
      fullName += firstName;
    }
  
    if (middleName && middleName.trim() !== '') {
      fullName += ` ${middleName}`;
    }
  
    if (lastName) {
      fullName += ` ${lastName}`;
    }
  
    return fullName.trim();
  }
}

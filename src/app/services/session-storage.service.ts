import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }
  
  public set(key: string, val: string): void {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, val);
  }

  public get(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  public readonly companyName = "Tax & Law";
  // public readonly apiUrl = "https://example.com/";
  public readonly apiUrl = "https://localhost:7290/api/";
  public readonly SS_TOKEN_KEY = "auth-token";
  public readonly SS_USER_NAME = "username";
  public readonly SS_USER_TYPE = "usertype";
  public readonly SS_USER_ID = "userid";
  constructor() { }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { Observable } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiBaseUrl = this.constants.apiUrl;
  constructor(private httpClient: HttpClient, 
    private sessionStorageService : SessionStorageService,
    private constants: ConstantsService) { }

  public postUnAuth(uriSegment: string, payload: any) : Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        })
    }
    return this.httpClient.post(this.apiBaseUrl + uriSegment, payload, httpOptions);
  }

  public get(uriSegment: string):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer '+this.sessionStorageService.get(this.constants.SS_TOKEN_KEY)
      })
    }
    return this.httpClient.get(`{this.apiBaseUrl}{uriSegment}`, httpOptions);
  }
}

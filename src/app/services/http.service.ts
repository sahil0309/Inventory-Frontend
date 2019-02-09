import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // baseUrl = 'http://localhost:59226/WCFService.svc/'; // Localhost
  baseUrl = 'http://13.232.187.94/DBCBService/WCFService.svc/'; // Server dev
  
  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, data: any) {
    return this.http.post(this.baseUrl + url, data);
  }

  put(url: string, data: any) {
    return this.http.put(this.baseUrl + url, data);
  }

  delete(url: string) {
    return this.http.delete(this.baseUrl + url);
  }
}

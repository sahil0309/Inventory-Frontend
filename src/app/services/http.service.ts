import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // baseUrl = 'http://localhost:59226/WCFService.svc/'; // Localhost
  baseUrl = 'http://13.232.187.94/DBCBService/WCFService.svc/'; // Server dev
  baseNodeUrl = "";

  constructor(private http: HttpClient) { }

  get(url: string, type: string) {
    console.log(type);
    let urlValue = (type == "api") ? (this.baseNodeUrl + url) : (type == 'user') ? this.baseUrl.concat(url) : '';
    console.log("urlvalue", urlValue);
    return this.http.get(urlValue);
  }

  post(url: string, type: string, data: any) {
    let urlValue = (type = "api") ? this.baseNodeUrl + url : this.baseUrl + url;
    return this.http.post(urlValue, data);
  }

  put(url: string, type: string, data: any) {
    let urlValue = (type = "api") ? this.baseNodeUrl + url : this.baseUrl + url;
    return this.http.put(urlValue, data);
  }

  delete(url: string, type: string) {
    let urlValue = (type = "api") ? this.baseNodeUrl + url : this.baseUrl + url;
    return this.http.delete(urlValue);
  }

}

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class DataService {
  constructor() { }

  public getSessionData(key: string){
    // return JSON.parse(localStorage);
    return JSON.parse(localStorage.getItem(key));
  }

  public setSessionData(key: string, data: any){
     // localStorage.`$name`(JSON.stringify(data));

     localStorage.setItem(key, JSON.stringify(data));
  }

}

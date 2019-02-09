import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppConfigService } from './app-config.service';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private appConfigService: AppConfigService
  ) {}

  authUser(objLogin: any){
    if (objLogin.user_name !== '' && objLogin.password !== '' ) {
      this.loggedIn.next(true);
      this.appConfigService.setSessionObj('userInfo', objLogin);
      this.login(objLogin);
    }
  }

  get isLoggedIn() {

    if (sessionStorage.getItem('userInfo')) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }

  getUserInfo() {

    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo'));
    } else {
      return false;
    }
  }

  login(user: any) {
    if (user.user_name !== '' && user.password !== '' ) {
      this.loggedIn.next(true);
      if (sessionStorage.getItem('userInfo')) {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

        this.router.navigate(['/dashboard']);

      }
    }
  }

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}

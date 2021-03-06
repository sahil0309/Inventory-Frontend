import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { HttpService } from './http.service';
import { DataService } from './data.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  data: any = {
    "objUserData": {
      // "user_id": this.getSessionObj('userInfo') ? this.getSessionObj('userInfo').user_id : null
      "user_id": 1,
    }
  }

  constructor(private http: HttpClient, private httpService: HttpService, private toastr: ToastrService, private dataService: DataService,
    private router: Router, private route: ActivatedRoute) {

    // console.log(this.getSessionObj('userInfo'));
  }

  getDistrictList() {
    try {
      return this.httpService.post('getDistrictList', 'user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getCityList() {
    try {
      return this.httpService.post('getCityList', 'user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getAreaList() {
    try {
      return this.httpService.post('getAreaList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getBuildingGradeList() {
    try {
      return this.httpService.post('getBuildingGradeList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getDesignationList() {
    try {
      return this.httpService.post('getDesignationList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getFloorGradeList() {
    try {
      return this.httpService.post('getFloorGradeList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getUsageList() {
    try {
      return this.httpService.post('getUsageList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getUnitGradeList() {
    try {
      return this.httpService.post('getUnitGradeList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getUserList() {
    try {
      return this.httpService.get('getUserList/4','user');
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getVisitorList() {
    try {
      return this.httpService.get('getVisitorList','user');
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getAllUserList() {
    try {
      return this.httpService.get('getUserList/0','user');
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getRoleList() {
    try {
      return this.httpService.get('getRoleList','user');
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getStockSizeList() {
    try {
      return this.httpService.post('getStockSizeList','user', this.data);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  setSessionObj(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getSessionObj(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  removeSessionObj(key: string) {
    sessionStorage.removeItem(key);
  }

  logout() {
    try {
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  authenticateUser() {
    try {
      let userInfo = this.getSessionObj('userInfo');
      // console.log('userInfo');
      // console.log(userInfo);

      if (userInfo) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      this.toastr.error(e.message);
    }
  }
}

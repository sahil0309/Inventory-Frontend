import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import * as _ from "lodash";

import { ToastrService } from 'ngx-toastr';

import { HttpService } from '../../../services/http.service';
import { AppConfigService } from '../../../services/app-config.service';
import { ExcelexportService } from '../../../services/excelexport.service';
import { AuthService } from '../../../services/auth.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  selectAllValue: boolean;
  isUserValid: boolean = false;
  userInfo: any;

  constructor(private httpService: HttpService, private appConfigService: AppConfigService, private authService: AuthService,
    private toastr: ToastrService, private excelService: ExcelexportService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    try{
      // console.log('In header component');
      this.userInfo = this.authService.getUserInfo();
      // console.log('this.userInfo', this.userInfo);
      this.isLoggedIn$ = this.authService.isLoggedIn;
      // console.log('this.isLoggedIn$', this.isLoggedIn$);
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  user_name: string = null;
  getUserName(){
    try{
      this.userInfo = this.authService.getUserInfo();
      this.user_name = this.userInfo.user_name;
      return this.user_name;
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  displayMenu(){
    try{
      this.userInfo = this.authService.getUserInfo();
      if(this.userInfo.user_name.trim().toLowerCase() == 'admin'){
        return true;
      }else if(this.userInfo.role_id == 2){
        return false;
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  // navigate(pageId){
  //   try{
  //
  //     console.log('Hey')
  //     if(pageId === 1){
  //       this.router.navigate(['/admin-dashboard']);
  //     }else if(pageId === 2){
  //       this.router.navigate(['/user-dashboard']);
  //     }else if(pageId === 3){
  //       this.router.navigate(['/building-info-entry']);
  //     }else{
  //       alert('Wrong input');
  //     }
  //   }catch(e){
  //     this.toastr.error(e.message);
  //   }
  // }

  logout(){
    try{
      this.authService.logout();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  // navigateToMaster(masterName: string): void{
  //   try {
  //     this.router.navigate([`/${masterName}`]);
  //   } catch (e) {
  //     this.toastr.error(e.message);
  //   }
  // }

  navigateToUserProfile(){
    try{

      this.userInfo = this.authService.getUserInfo();
      console.log('this.userInfo', this.userInfo);
      if(this.userInfo){
        this.router.navigate(['/user-profile', {user_id: this.userInfo.user_id, profile_type: 'edit'}]);
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

}

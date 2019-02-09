import { Component, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../services/http.service';
import { DataService } from '../../../../services/data.service';
import { AppConfigService } from '../../../../services/app-config.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;
  charactersPattern = "^[a-zA-Z \-\']+";
  characterPattern = "^[a-zA-Z]+";
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  userId: number = 0;
  objSessionInfo: any;

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private httpService: HttpService,
    private appConfigService: AppConfigService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) { }

  ngOnInit() {
    try{

      this.objSessionInfo = this.appConfigService.getSessionObj('userInfo');
      console.log('this.objSessionInfo');
      console.log(this.objSessionInfo);
      this.resetUserObject();
      this.bindUserData();

      this.getUserInfo();
      this.getRoleList();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  objUser: any;
  resetUserObject(){
    try{
      this.objUser = {
        user_id: 0,
        user_code: null,
        first_name: null,
        last_name: null,
        user_name: null,
        password: null,
        mobile_number: null,
        alternate_contact_numbers: null,
        email_id: null,
        alternate_email_id: null,
        role_id: null,
        office_location_id: 0,
        active: 1,
        created_by: null,
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        user_id: [this.objUser.user_id, Validators.required],
        user_code: [this.objUser.user_code, Validators.required],
        first_name: [this.objUser.first_name, [Validators.required, Validators.pattern(this.charactersPattern)]],
        last_name: [this.objUser.last_name, [Validators.required, Validators.pattern(this.charactersPattern)]],
        user_name: [this.objUser.user_name, Validators.required],
        password: [{value: this.objUser.password, disabled: (this.objSessionInfo.role_id == 1 ? false : true)}, [Validators.required, Validators.pattern(this.passwordPattern)]],
        mobile_number: [this.objUser.mobile_number, [Validators.required, Validators.pattern(this.mobnumPattern)]],
        alternate_contact_numbers: [this.objUser.alternate_contact_numbers],
        email_id: [this.objUser.email_id, [Validators.required, Validators.pattern(this.emailPattern)]],
        alternate_email_id: [this.objUser.alternate_email_id, [Validators.pattern(this.emailPattern)]],
        role_id: [{value: this.objUser.role_id, disabled: (this.objSessionInfo.role_id == 1 ? false : true)}, Validators.required],
        office_location_id: [this.objUser.office_location_id, Validators.required],
        active: [this.objUser.active, Validators.required],
        created_by: [this.appConfigService.getSessionObj('userInfo').user_id],
      });

      this.findInvalidControls();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  list_role: any;
  getRoleList(){
    try{
      this.appConfigService.getRoleList().subscribe((res) => {
        this.list_role = res;
      }, (err) => {
        this.toastr.error(err.statusText);
      });
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  profileType: string = null;
  objUserRequest: any;
  getUserInfo(){
    try{

      this.route.params.subscribe(params => {
        this.userId = params.user_id;
        console.log('this.userId', this.userId);
        this.profileType = params.profile_type;
        console.log('this.profileType', this.profileType);

        let userId = 0;
        if(this.userId == 0){
          userId = this.userId; // Create new user
        }else if(this.userId > 0){
          userId = this.userId;
          this.getUserDetails(userId); // Edit user
        }else{
          this.toastr.error('Some error occurred, contact Administrator');
        }
      });
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  getUserDetails(userId: number){
    try{

      this.objUserRequest = {
        user_id: userId
      }

      let data = {
        'objUserData': this.objUserRequest
      };

      this.httpService.post(`getUserInfo`, data).subscribe((res: any) => {
        this.objUser = res;
        console.log('this.objUser');
        console.log(this.objUser);
        // let abc = this.appConfigService.setSessionObj('userInfo', this.objUser);
        this.bindUserData();
      }, (err) => {
        this.toastr.error(err.statusText);
      });

    }catch(e){
      this.toastr.error(e.message);
    }
  }

  aplphabetsOnly(event: any) {
    try{

      var value = String.fromCharCode(event.which);
      if(/^[a-zA-Z \-\']+$/.test(value)){

      }else{
        return false;
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  saveUserProfile(){
    try{

      let data = {
        'objUserData': this.userForm.getRawValue()
      };

      console.log('data', data);

      this.httpService.post(`saveUser`, data).subscribe((res: any) => {
        // this.getUserInfo();
        this.toastr.success(res.message);
        this.location.back();
      }, (err) => {
        this.toastr.error(err.statusText);
      });
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('invalid controls');
    console.log(invalid);
  }
}

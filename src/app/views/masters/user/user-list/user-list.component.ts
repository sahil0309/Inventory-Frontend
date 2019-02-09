import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../services/http.service';
import { DataService } from '../../../../services/data.service';
import { AppConfigService } from '../../../../services/app-config.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userForm: FormGroup;
  public modalRef: BsModalRef;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService, private toastr: ToastrService, private httpService: HttpService,
    private appConfigService: AppConfigService, private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  options: any;
  role_id: number = 0;
  ngOnInit() {
    try{
      this.getUserList();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  list_user: any;
  getUserList(){
    try{
      this.appConfigService.getAllUserList().subscribe(res => {
        this.list_user = res;
      });
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
        active: 1
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  bindUserData(){
    try{
      this.userForm = this.formBuilder.group({
        user_id: [this.objUser.user_id, Validators.required],
        first_name: [this.objUser.first_name, Validators.required],
        last_name: [this.objUser.last_name, Validators.required],
        user_name: [this.objUser.user_name, Validators.required],
        password: [this.objUser.password, Validators.required],
        mobile_number: [this.objUser.mobile_number, Validators.required],
        alternate_contact_numbers: [this.objUser.alternate_contact_numbers, Validators.required],
        email_id: [this.objUser.email_id, Validators.required],
        alternate_email_id: [this.objUser.alternate_email_id, Validators.required],
        active: [this.objUser.active],

      });
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  saveuser(){
    try{

      let userData = [];
      userData = this.dataService.getSessionData('list_user');

      if(userData){

      }else{
        userData = [];
      }

      userData.push(this.userForm.value);

      this.dataService.setSessionData('list_user', userData);

      this.modalRef.hide();
      this.getUserList();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  addUser(){
    try{
      this.router.navigate(['/user-profile', {user_id: 0, profile_type: 'create'}]);
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  editUser(obj){
    try{
      this.router.navigate(['/user-profile', {user_id: obj.user_id, profile_type: 'edit'}]);
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  user_name_modal: string;
  deleteUserConfirmation(template: TemplateRef<any>, objUser){
    try{

      if(objUser){
        this.user_name_modal = objUser.user_name;

        this.resetUserObject();
        // Assign selected district obj to district object of view (i.e. html)
        this.objUser = objUser;
        this.bindUserData();

        this.modalRef = this.modalService.show(template);
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  reason: string;
  deleteUser(){
    try{

      let data = {
        'objUserData': this.userForm.value
      }

      this.userForm.value.reason = this.reason;

      console.log(this.userForm.value);

      this.httpService.put('deleteUser', data).subscribe((res: any) => {

        console.log(res);

        if(res.status === 'success'){
          this.toastr.success('Data deleted successfully');
          this.modalRef.hide();

          this.getUserList(); // Bind user data
        }else{
          this.toastr.error(res.message);
        }
      }, (err) => {
        this.toastr.error(err.statusText);
      });

      this.modalRef.hide();

    }catch(e){
      this.toastr.error(e.message);
    }
  }

  closeModal(template: TemplateRef<any>){
    try{
      this.modalRef.hide();
    }catch(e){
      this.toastr.error(e.message);
    }
  }
}

import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../services/http.service';
import { DataService } from '../../../services/data.service';
import { AppConfigService } from '../../../services/app-config.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  public modalRef: BsModalRef;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService, private toastr: ToastrService, private httpService: HttpService,
    private appConfigService: AppConfigService, private dataService: DataService) { }

  options: any;
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
      this.httpService.get(`getUserList`).subscribe(res => {
        this.list_user = res;
        console.log(this.list_user);
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

  addUser(template: TemplateRef<any>){
    try{
      this.modalRef = this.modalService.show(template);

      this.resetUserObject();
      this.bindUserData();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  saveuser(){
    try{

      let userData = [];
      userData = this.dataService.getSessionData('list_user');
      console.log(userData);

      if(userData){

      }else{
        userData = [];
      }

      userData.push(this.userForm.value);

      console.log('userData');
      console.log(userData);
      this.dataService.setSessionData('list_user', userData);

      this.modalRef.hide();
      this.getUserList();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  user_name_modal: string;
  deleteuserConfirmation(template: TemplateRef<any>, objUser){
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
  deleteuser(){
    try{

      let data = {
        'objUserData': this.userForm.value
      }

      this.userForm.value.reason = this.reason;

      console.log(this.userForm.value);

      // this.httpService.put('deleteDistrict', data).subscribe((res) => {
      //
      //   console.log(res);
      //
      //   if(res[0].status === 'success'){
      //     this.toastr.success('Data deleted successfully');
      //     this.modalRef.hide();
      //
      //     this.getDistrictList(); // Bind district data
      //   }else{
      //     this.toastr.success(res[0].message);
      //   }
      // }, (err) => {
      //   this.toastr.error(err.statusText);
      // });

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

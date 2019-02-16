import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { AppConfigService } from '../../services/app-config.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private modalService: BsModalService, private toastr: ToastrService, private httpService: HttpService,
    private appConfigService: AppConfigService, private dataService: DataService) { }

  display_name: string = null;
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  ngOnInit() {
    try{

      this.display_name = this.appConfigService.getSessionObj('userInfo').display_name;

      this.resetChangePasswordObject();
      this.bindChangePasswordData();
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  objChangePassword: any;
  resetChangePasswordObject(){
    try{
      this.objChangePassword = {
        user_id: this.appConfigService.getSessionObj('userInfo').user_id,
        current_password: null,
        new_password: null,
        confirm_new_password: null,
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  bindChangePasswordData(){
    try{
      this.changePasswordForm = this.formBuilder.group({
        user_id: [this.objChangePassword.user_id, Validators.required],
        current_password: [this.objChangePassword.current_password, [Validators.required, Validators.pattern(this.passwordPattern)]],
        new_password: [this.objChangePassword.new_password, [Validators.required, Validators.pattern(this.passwordPattern)]],
        confirm_new_password: [this.objChangePassword.confirm_new_password, [Validators.required, Validators.pattern(this.passwordPattern)]],
      });

      this.onChanges();

    }catch(e){
      this.toastr.error(e.message);
    }
  }


  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  newPassword: string;
  confirmNewPassword: string;
  onChanges(): void {
    try{

      this.changePasswordForm.get('new_password').valueChanges.subscribe(val => {
        this.newPassword = `${val}`;
        // console.log(this.newPassword);
      });

      this.changePasswordForm.get('confirm_new_password').valueChanges.subscribe(val => {
        this.confirmNewPassword = `${val}`;
        // console.log(this.confirmNewPassword);
      });
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  showErrorMessage: boolean = false;
  error_message: string;
  comparePasswords(event){
    try{

      if(!this.changePasswordForm.controls.confirm_new_password.pristine){
        if(this.newPassword == this.confirmNewPassword){
          this.showErrorMessage = false;
        }else{
          this.error_message = 'Passwords do not match';
          this.showErrorMessage = true;
        }
      }else{
        // console.log('Not comparing passwords yet');
      }
    }catch(e){
      this.toastr.error(e.message);
    }
  }

  changePassword(){
    try{

      let data = {
        objPasswordData: this.changePasswordForm.value
      }

      this.httpService.post('changePassword','user', data).subscribe((res: any) => {

        if(res.status === 'success'){
          this.toastr.success(res.message);
          this.ngOnInit();
        }else{
          this.toastr.error(res.message);
        }
      }, (err) => {
        this.toastr.error(err.statusText);
      });

    }catch(e){
      this.toastr.error(e.message);
    }
  }
}

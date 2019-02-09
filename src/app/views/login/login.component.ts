import { Component, OnInit, TemplateRef, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { AppConfigService } from '../../services/app-config.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public modalRef: BsModalRef;
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';

  constructor(private httpService: HttpService, private appConfigService: AppConfigService, private authService: AuthService,
    private formBuilder: FormBuilder, private modalService: BsModalService, private toastr: ToastrService,
    private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private http: HttpClient,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    try{
      this.authService.logout();
      this.resetLoginObject();
      this.bindLoginData();
      this.cdr.detectChanges();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  objLogin: any;
  resetLoginObject(){
    try{
      this.objLogin = {
        user_name: '',
        password: '',
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  bindLoginData(){
    try{
      this.loginForm = this.formBuilder.group({
        user_name: [this.objLogin.user_name, Validators.required],
        password: [this.objLogin.password, [Validators.required, Validators.pattern(this.passwordPattern)]],
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  submitLogin(){
    try{
      // this.toastr.info('Form submitted');

      let data = {
        objLoginData: this.loginForm.value
      }

      this.authService.authUser(this.loginForm.value);

      // this.httpService.post('authUser', data).subscribe((res: any) => {
      //
      //   console.log(res[0]);
      //
      //   if(res[0].status === 'success'){
      //     let abc = this.appConfigService.setSessionObj('userInfo', res[0]);
      //     this.authService.login(this.loginForm.value);
      //     // this.navigateInside();
      //   }else{
      //     this.snackbarService.openSnackBar(res[0].message, 'Close', 'error-snackbar');
      //   }
      // }, (err: any) => {
      //   console.log(err);
      //   this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      // });

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // public forgotPassword(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);
  // }

  user_name: string;
  forgotPassword(template: TemplateRef<any>){
    try{
      if(this.loginForm.value.user_name){
        this.user_name = this.loginForm.value.user_name;
        this.modalRef = this.modalService.show(template);
      }else{
        this.snackbarService.openSnackBar('Please enter valid username', 'Close', 'warning-snackbar');
      }
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  navigateInside(): void{
    try{
      this.router.navigate(['/user-dashboard', {user_id: this.appConfigService.getSessionObj('userInfo').user_id}]);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  sendPassword(){
    try{

      this.objLogin.user_name = this.user_name;

      let data = {
        objLoginData: this.objLogin
      }

      this.httpService.post('sendPassword', data).subscribe((res: any) => {

        if(res.status === 'success'){
          this.toastr.success(res.message);
          this.closeModal();
        }else{
          this.toastr.error(res.message);
        }
      }, (err: any) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  closeModal(){
    try{
      this.modalRef.hide();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

}

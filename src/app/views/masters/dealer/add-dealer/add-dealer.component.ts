import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../global/adapters/date.adapter';

import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from '../../../../services/snackbar.service';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { PromiseService } from '../../../../services/promise.service'
import { AppConfigService } from '../../../../services/app-config.service';


@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
})
export class AddDealerComponent implements OnInit {

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dataService: DataService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private toastr: ToastrService,
    private promiseService: PromiseService,
    public dialog: MatDialog) { }



  dealerId: number;
  template: string;
  templateType: string;
  dealerForm: FormGroup;
  ngOnInit() {
    try {
      this.resetObjDealerForm();
      this.bindDealerForm();

      this.route.params.subscribe(params => {
        this.dealerId = +params["id"];
        this.template = params["template"];
        // console.log(this.productId, this.template);
        if (this.template == 'Edit') {
          this.templateType = "Edit Dealer";
          this.getDealerDetailsById();
        }
        else {
          this.templateType = "Add Dealer";
          this.bindDealerForm();
        }
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  objDealerForm: any = [];
  resetObjDealerForm() {
    this.objDealerForm = {
      createdBy: null,
      createdOn: null,
      dealerAddress: null,
      dealerAgencyName: null,
      dealerCity: null,
      dealerContactPerson: null,
      dealerEmail: null,
      dealerId: null,
      dealerMobileNumber: null,
      dealerPhoneNumber: null,
      dealerPinCode: null,
      dealerUserName: null,
      isActive: null,
      reason: null,
      updatedBy: null,
      updatedOn: null
    }
  }

  bindDealerForm() {
    try {
      this.dealerForm = this.formBuilder.group({
        createdBy: this.objDealerForm.createdBy,
        createdOn: this.objDealerForm.createdOn,
        dealerAddress: this.objDealerForm.dealerAddress,
        dealerAgencyName: this.objDealerForm.dealerAgencyName,
        dealerCity: this.objDealerForm.dealerCity,
        dealerContactPerson: this.objDealerForm.dealerContactPerson,
        dealerEmail: this.objDealerForm.dealerEmail,
        dealerId: this.objDealerForm.dealerId,
        dealerMobileNumber: this.objDealerForm.dealerMobileNumber,
        dealerPhoneNumber: this.objDealerForm.dealerPhoneNumber,
        dealerPinCode: this.objDealerForm.dealerPinCode,
        dealerUserName: this.objDealerForm.dealerUserName,
        isActive: this.objDealerForm.isActive,
        reason: this.objDealerForm.reason,
        updatedBy: this.objDealerForm.updatedBy,
        updatedOn: this.objDealerForm.updatedOn
      })
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getDealerDetailsById() {
    try {
      console.log(typeof (this.dealerId));
      let url = "dealer/" + this.dealerId;
      this.promiseService.get(url, "api").then((res: any) => {
        this.objDealerForm = res
        console.log(this.objDealerForm);
        this.bindDealerForm();
      }).catch(err => this.toastr.error(err.message));
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  Back() {
    try {
      this.router.navigate(["dealer-list"]);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  save() {
    try {
      console.log(this.dealerForm.value);
      if (this.templateType !== "Edit Dealer") {
        this.promiseService.post('dealer', 'api', this.dealerForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["dealer-list"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
      else {
        this.promiseService.put('dealer', 'api', this.dealerForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["dealer-list"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

}

import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LOCALE_ID } from '@angular/core'
import * as moment from 'moment'
import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';
import { switchMap, concat } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../global/adapters/date.adapter';

import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from '../../../services/snackbar.service';
import { DataService } from '../../../services/data.service';
import { HttpService } from '../../../services/http.service';
import { PromiseService } from '../../../services/promise.service'
import { AppConfigService } from '../../../services/app-config.service';


@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css'],
  // providers: [
  //   { provide: LOCALE_ID, useValue: 'en-IN' }
  // ]
})
export class AddStockComponent implements OnInit {
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

  purchaseId: number;
  template: string;
  templateType: string;
  purchaseForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dealerFormControl = new FormControl();
  productFormControl = new FormControl();
  filteredDealerOptions: Observable<string[]>;
  filteredProductOptions: Observable<string[]>;

  ngOnInit() {

    try{

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
    // this.getCategoryList();
    this.getProductList();
    this.getDealerList();
    this.resetobjPurchaseForm();
    this.bindPurchaseForm();

    this.route.params.subscribe(params => {
      this.purchaseId = +params["id"];
      this.template = params["template"];
      // console.log(this.productId, this.template);
      if (this.template == 'Edit') {
        this.templateType = "Edit Stock";
        this.getPurchaseDetailsById();
      }
      else {
        this.templateType = "Add Stock";
        this.bindPurchaseForm();
      }

      this.onChanges();
    });
  }

  totalCost: number = 0;
  onChanges(): void {
    try{

      this.purchaseForm.get('costPrice').valueChanges.subscribe(val => {
        console.log('costPriceVal', val);
        this.calculateTotalCost(this.purchaseForm.value.quantityPurchased, val);
      });

      this.purchaseForm.get('quantityPurchased').valueChanges.subscribe(val => {
        console.log('quantityVal', val);
        this.calculateTotalCost(val, this.purchaseForm.value.costPrice);
      });

    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  calculateTotalCost(quantityValue: number = 0, costPriceValue: number = 0){
    try{
      if((quantityValue && quantityValue > 0) && costPriceValue && costPriceValue > 0){
        this.totalCost = quantityValue * costPriceValue;
        console.log('this.totalCost', this.totalCost);
      }else{
        this.totalCost = 0;
        console.log('this.totalCost', this.totalCost);
      }
    }catch(e){

    }
  }

  dealer_list: any;
  getDealerList() {
    try {
      this.promiseService.get('dealer', 'api').then((res: any) => {
        this.dealer_list = res;
        console.log("categoryList", this.dealer_list);
        // this._filterCategory('');
        this.filteredDealerOptions = this.dealerFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterDealer(value))
          );

      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  product_list: any
  getProductList() {
    try {
      this.promiseService.get('product', 'api').then((res: any) => {
        this.product_list = res;
        console.log("productList", this.product_list);
        // this._filterCategory('');
        this.filteredProductOptions = this.productFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProduct(value))
          );

      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  private _filterDealer(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log('value', filterValue);
    if (this.dealer_list) {
      if (value.length > 0)
        return this.dealer_list.map(e => e.dealerAgencyName.concat('(', e.dealerUserName, ')')).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.dealer_list.map(e => e.dealerAgencyName.concat('(', e.dealerUserName, ')'));
      }
    }
    // console.log("category list", this.category_list);
  }


  private _filterProduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    // console.log('value', filterValue);
    if (this.product_list) {
      if (value.length > 0)
        return this.product_list.map(e => e.productName).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.product_list.map(e => e.productName)
      }
    }
    // console.log("category list", this.category_list);
  }

  objPurchaseForm: any = [];
  resetobjPurchaseForm() {
    this.objPurchaseForm = {
      productId: null,
      costPrice: null,
      purchaseTimeStamp: null,
      quantityPurchased: null,
      dealerId: 1,
      purchaseId: null
    }
  }

  bindPurchaseForm() {
    try {
      this.purchaseForm = this.formBuilder.group({
        productId: [this.objPurchaseForm.productId],
        costPrice: [this.objPurchaseForm.costPrice],
        // sellingPrice: [this.objPurchaseForm.sellingPrice],
        purchaseTimeStamp: [this.objPurchaseForm.purchaseTimeStamp],
        dealerId: [this.objPurchaseForm.dealerId],
        quantityPurchased: [this.objPurchaseForm.quantityPurchased],
        purchaseId: [this.objPurchaseForm.purchaseId]
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getPurchaseDetailsById() {
    try {
      let url = "purchase/" + this.purchaseId;
      this.promiseService.get(url, 'api').then((res: any) => {
        res.purchaseTimeStamp = new Date(res.purchaseTimeStamp);
        this.objPurchaseForm = res;
        if (this.product_list) {
          let productObj = this.product_list.filter(e => e.productId == res.productId)[0];
          this.productFormControl.patchValue(productObj.productName);
        }
        if (this.dealer_list) {
          let dealerObj = this.dealer_list.filter(e => e.dealerId == res.dealerId)[0];
          this.dealerFormControl.patchValue(dealerObj.dealerAgencyName.concat('(', dealerObj.dealerUserName, ')'));
        }
        console.log("byId", res);
        this.bindPurchaseForm();
      }, (err) => {
        this.toastr.error(err.statusText);
      })
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  save() {
    try {
      console.log(this.purchaseForm.value.purchaseTimeStamp);
      let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
      // console.log(this.purchaseForm.value.purchaseTimeStamp.toLocaleDateString("en-IN"), "Locale");
      // console.log(this.purchaseForm.value.purchaseTimeStamp.toISOString().split('T')[0]);
      // console.log(this.purchaseForm.value.purchaseTimeStamp.toUTCString());
      // console.log(moment(this.purchaseForm.value.purchaseTimeStamp).format("YYYY-MM-DD"), "Moment");
      // console.log(moment(this.purchaseForm.value.purchaseTimeStamp).format("YYYY-MM-DD h:mm:ss A"), "Moment Date Time")
      // let date1 = this.purchaseForm.value.purchaseTimeStamp.setHours(this.purchaseForm.value.purchaseTimeStamp.getHours() + 6);
      let date = moment(this.purchaseForm.value.purchaseTimeStamp).format("YYYY-MM-DD HH:mm:ss");
      // console.log();
      let productObj = this.product_list.filter(e => e.productName === this.productFormControl.value)[0];

      let dealerUsername = this.dealerFormControl.value.split('(')[1].split(')')[0];
      console.log(dealerUsername);

      let dealerObj = this.dealer_list.filter(e => e.dealerUserName == dealerUsername)[0];

      this.purchaseForm.patchValue({
        productId: productObj.productId,
        purchaseTimeStamp: date,
        dealerId: dealerObj.dealerId
      });
      console.log(this.purchaseForm.value);

      if (this.templateType !== "Edit Stock") {
        this.promiseService.post('purchase', 'api', this.purchaseForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["purchase-dashboard"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
      else {
        this.promiseService.put('purchase', 'api', this.purchaseForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["purchase-dashboard"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          this.toastr.error(err.error);
        });
      }
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  Back() {
    try {
      this.router.navigate(["purchase-dashboard"]);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }




}

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
  modeOfPayments: string[] = ["Cheque", "Cash", "Card"];
  ngOnInit() {

    try {

    } catch (e) {
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
    });
  }


  createProduct(): FormGroup {
    try {
      let productObj = this.product_list.filter(e => e.productName == this.productFormControl.value)[0];
      return this.formBuilder.group({
        productId: productObj.productId,
        productName: productObj.productName,
        cgstPercentage: productObj.cgstPercentage,
        sgstPercentage: productObj.sgstPercentage,
        cgst: null,
        sgst: null,
        costPrice: null,
        quantityPurchased: null,
        totalPrice: null,
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  products: any = [];
  addProduct() {
    try {
      // this.productFormControl.value
      let productObj = this.product_list.filter(e => e.productName == this.productFormControl.value)[0];
      let check = this.purchaseForm.value.products.map(e => e.productId).some(e => e == productObj.productId);
      console.log(check);
      if (!check) {
        this.products = this.purchaseForm.get('products') as FormArray
        this.products.push(this.createProduct());
        console.log(this.products);
        console.log(this.purchaseForm.value);
      }
      else
        this.snackbarService.openSnackBar('Product Already Added in the list', 'Close', 'error-snackbar');
      console.log(this.purchaseForm.value.products);
      // newObj = null;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  //calculating cgst and sgst values for a product added
  calculateTotalPrice(item) {
    try {

      let costPrice = item.controls.costPrice.value;
      let quantityPurchased = item.controls.quantityPurchased.value;
      let cgstPercentage = item.controls.cgstPercentage.value;
      let sgstPercentage = item.controls.sgstPercentage.value;
      console.log(costPrice, quantityPurchased);
      if (costPrice != null && quantityPurchased != null) {
        item.controls.totalPrice.patchValue((costPrice) * (quantityPurchased));
        item.controls.cgst.patchValue((costPrice * cgstPercentage * quantityPurchased) / 100);
        item.controls.sgst.patchValue((costPrice * sgstPercentage * quantityPurchased) / 100);
        this.calculateBilltotal();
      }
      console.log(this.purchaseForm.value);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }


  billTotal: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;
  calculateBilltotal() {
    try {
      this.billTotal = 0;
      this.totalCgst = 0;
      this.totalSgst = 0;
      this.purchaseForm.value.products.forEach(element => {
        this.billTotal += element.totalPrice;
        this.totalSgst += element.cgst;
        this.totalCgst += element.sgst;
      });
      this.purchaseForm.patchValue({
        totalAmount: this.billTotal,
        netGST: this.totalCgst + this.totalSgst
      });
      console.log(this.purchaseForm.value);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }


  onDelete(iProduct) {
    try {
      console.log(iProduct);
      this.products.removeAt(iProduct);
      console.log(this.purchaseForm.value.products);
      this.calculateBilltotal();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
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
      // productId: null,
      // costPrice: null,
      // quantityPurchased: null,
      purchaseTimeStamp: null,
      products: [],
      dealerId: null,
      purchaseId: null,
      vehicleNumber: null,
      labourCharges: null,
      modeOfPayment: null,
      amountPaid: null,
      totalAmount: null,
      netGST: null
    }
  }

  bindPurchaseForm() {
    try {
      this.purchaseForm = this.formBuilder.group({
        // productId: [this.objPurchaseForm.productId],
        // costPrice: [this.objPurchaseForm.costPrice],
        // sellingPrice: [this.objPurchaseForm.sellingPrice],
        purchaseTimeStamp: [this.objPurchaseForm.purchaseTimeStamp, Validators.required],
        products: this.formBuilder.array([]),
        dealerId: [this.objPurchaseForm.dealerId],
        purchaseId: [this.objPurchaseForm.purchaseId],
        vehicleNumber: [this.objPurchaseForm.vehicleNumber, [Validators.pattern('^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{1,4}$'), Validators.required]],
        labourCharges: [this.objPurchaseForm.labourCharges],
        modeOfPayment: [this.objPurchaseForm.modeOfPayment],
        amountPaid: [this.objPurchaseForm.amountPaid],
        totalAmount: [this.objPurchaseForm.totalAmount],
        netGST: [this.objPurchaseForm.netGST]
      });
      this.products = this.purchaseForm.get('products') as FormArray
      this.objPurchaseForm.products.forEach(productObj => {
        this.products.push(this.bindProduct(productObj));
      });
      console.log(this.purchaseForm.value);
      this.calculateBilltotal();
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  bindProduct(product): FormGroup {
    try {
      return this.formBuilder.group({
        productId: product.productId,
        productName: product.productName,
        cgstPercentage: product.cgstPercentage,
        sgstPercentage: product.sgstPercentage,
        cgst: product.cgst,
        sgst: product.sgst,
        costPrice: product.costPrice,
        quantityPurchased: product.quantityPurchased,
        totalPrice: product.totalPrice,
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getPurchaseDetailsById() {
    try {
      let url = "purchase/" + this.purchaseId;
      this.promiseService.get(url, 'api').then((res: any) => {
        // res.purchaseTimeStamp = new Date(res.purchaseTimeStamp);
        console.log(res);
        this.objPurchaseForm = res;
        // if (this.product_list) {
        //   let productObj = this.product_list.filter(e => e.productId == res.productId)[0];
        //   this.productFormControl.patchValue(productObj.productName);
        // }
        if (this.dealer_list) {
          let dealerObj = this.dealer_list.filter(e => e.dealerId == res.dealerId)[0];
          this.dealerFormControl.patchValue(dealerObj.dealerAgencyName.concat('(', dealerObj.dealerUserName, ')'));
        }
        // console.log("byId", res);
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
      let date = moment(this.purchaseForm.value.purchaseTimeStamp).format("YYYY-MM-DD HH:mm:ss");

      let dealerUsername = this.dealerFormControl.value.split('(')[1].split(')')[0];
      console.log(dealerUsername);

      let dealerObj = this.dealer_list.filter(e => e.dealerUserName == dealerUsername)[0];

      this.purchaseForm.patchValue({
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

  get f() {
    return this.purchaseForm.controls;
  }




}

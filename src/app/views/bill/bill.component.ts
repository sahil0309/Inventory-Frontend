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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../global/adapters/date.adapter';

import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { PromiseService } from '../../services/promise.service'
import { AppConfigService } from '../../services/app-config.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})

export class BillComponent implements OnInit {

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

  productFormControl = new FormControl();
  customerFormControl = new FormControl();
  filteredProductOptions: Observable<string[]>
  filteredCustomerOptions: Observable<string[]>

  ngOnInit() {
    this.getStockList();
    this.getCustomerList();
    this.resetObjBill();
  }

  billObj: any = [];
  resetObjBill() {
    try {
      this.billObj = {
        userId: null,
        amountPaid: null,
        billDate: null,
        products: []
      }
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  billTotal: number = 0;
  addProduct() {
    try {
      // this.productFormControl.value
      let productObj = this.stockList.filter(e => e.productName == this.productFormControl.value)[0];
      let check = this.billObj.products.map(e => e.productId).some(e => e == productObj.productId);
      let newObj = null
      console.log(check);
      if (!check) {
        let newObj = {
          productId: productObj.productId,
          productName: productObj.productName,
          sellingPrice: null,
          quantitySold: null,
          totalSellingPrice: null,
        }
        this.billObj.products.push(newObj);
      }
      else
        this.snackbarService.openSnackBar('Product Already Added in the list', 'Close', 'error-snackbar');
      console.log(this.billObj);
      // newObj = null;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  onDelete(iProduct) {
    try {
      console.log(iProduct);
      // this.billTotal -= this.billObj.products[iProduct].totalSellingPrice;
      this.billObj.products.splice(iProduct, 1);
      this.calculateBilltotal();
      console.log(this.billObj);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  userBalance: any;
  showBalance: boolean = false;
  onSelection() {
    try {
      // console.log(this.customerFormControl.value);
      let customerUserName = this.customerFormControl.value.split('(')[1].split(')')[0];
      console.log(customerUserName);
      let userObj = this.customerList.filter(e => e.customerUserName == customerUserName);
      this.billObj.userId = userObj[0].customerId;
      this.userBalance = userObj[0].customerBalance;
      this.showBalance = true;
      console.log(this.billObj);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }


  quantityInStock: number = 0;
  showQuantity: boolean = false;
  onProductSelection() {
    try {
      let productObj = this.stockList.filter(e => e.productName == this.productFormControl.value)[0];
      this.quantityInStock = productObj.quantityAvailable;
      this.showQuantity = true;
      console.log(productObj);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  calculateTotalPrice(item) {
    try {
      console.log(item);
      if (item.sellingPrice !== null && item.quantitySold !== null && item.sellingPrice.length > 0 && item.quantitySold > 0) {
        // console.log(typeof (+item.sellingPrice));
        item.totalSellingPrice = (+item.sellingPrice) * (+item.quantitySold);
        // this.billTotal += item.totalSellingPrice;//create a function to calculate bill total
        this.calculateBilltotal();
        console.log(item.totalSellingPrice);
      }
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  calculateBilltotal() {
    try {
      this.billTotal = 0;
      this.billObj.products.forEach(element => {
        this.billTotal += element.totalSellingPrice;
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Reset() {
    try {
      this.resetObjBill();
      this.customerFormControl.reset();
      this.productFormControl.reset();
      this.showBalance = false;
      this.billTotal = 0;
      this.userBalance = 0;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Pay() {
    try {
      console.log(this.billObj);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  stockList: any
  getStockList() {
    try {
      this.promiseService.get('product', 'api').then((res: any) => {
        this.stockList = res;
        console.log("stockList", this.stockList);
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
  private _filterProduct(value: string): string[] {

    // console.log('value', filterValue);
    if (this.stockList && value) {
      const filterValue = value.toLowerCase();
      if (value.length > 0)
        return this.stockList.map(e => e.productName).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.stockList.map(e => e.productName)
      }
    }
    else {
      return this.stockList.map(e => e.productName);
    }
    // console.log("category list", this.category_list);
  }


  customerList: any = [];
  getCustomerList() {
    try {
      this.promiseService.get('customer', 'api').then((res: any) => {
        this.customerList = res;
        console.log("customerList", this.customerList);
        // this._filterCategory('');  
        this.filteredCustomerOptions = this.customerFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterCustomer(value))
          );

      }, err => {
        this.snackbarService.openSnackBar(err.message, 'Close', 'error-snackbar');
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  private _filterCustomer(value: string): string[] {

    // console.log('value', filterValue);
    if (this.customerList && value) {
      const filterValue = value.toLowerCase();
      if (value.length > 0)
        return this.customerList.map(e => e.customerName.concat('(', e.customerUserName, ')')).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.customerList.map(e => e.customerName.concat('(', e.customerUserName, ')'));
      }
    }
    else {
      // console.log("else");
      return this.customerList.map(e => e.customerName.concat('(', e.customerUserName, ')'));
    }
    // console.log("category list", this.category_list);
  }


  generateBill() {
    try {
      var data = document.getElementById('contentToConvert');
      html2canvas(data).then(canvas => {
        // Few necessary setting options
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('MYPdf.pdf'); // Generated PDF
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}

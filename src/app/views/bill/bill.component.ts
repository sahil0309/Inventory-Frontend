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
  todaysDate = new Date();
  modeOfPayments: string[] = ["Cheque", "Cash", "Card"];
  ngOnInit() {
    this.getStockList();
    this.getCustomerList();
    this.resetObjBill();
  }

  billObj: any = [];
  resetObjBill() {
    try {
      this.billObj = {
        dealerId: null,
        amountPaid: null,
        billDate: null,
        modeOfPayment: null,
        vehicleNumber: null,
        labourCharges: null,
        products: [],
        totalAmount: null,
        netGST: null
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
      // let newObj = null
      console.log(check);
      if (!check) {
        let newObj = {
          productId: productObj.productId,
          productName: productObj.productName,
          cgstPercentage: productObj.cgstPercentage,
          sgstPercentage: productObj.sgstPercentage,
          igstPercentage: productObj.igstPercentage,
          igst: null,
          cgst: null,
          sgst: null,
          sellingPrice: null,
          quantityPurchased: null,
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
  dealerObj: any = [];
  onSelection() {
    try {
      // console.log(this.customerFormControl.value);
      let dealerUserName = this.customerFormControl.value.split('(')[1].split(')')[0];
      let dealerObj = this.dealerList.filter(e => e.dealerUserName == dealerUserName);
      this.dealerObj = this.dealerList.filter(e => e.dealerUserName == dealerUserName);
      console.log(dealerObj);
      this.billObj.dealerId = dealerObj[0].dealerId;
      this.userBalance = 0;
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
      this.quantityInStock = productObj.quantity;
      this.showQuantity = true;
      console.log(productObj);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  calculateTotalPrice(item) {
    try {
      console.log(item);
      if (item.sellingPrice !== null && item.quantityPurchased !== null) {

        if (item.quantityPurchased > this.quantityInStock)
          this.snackbarService.openSnackBar("enter quantity less than in stock", 'Close', 'error-snackbar');

        else {
          item.totalSellingPrice = item.sellingPrice * item.quantityPurchased;
          item.cgst = item.sellingPrice * item.quantityPurchased * item.cgstPercentage / 100;
          item.sgst = item.sellingPrice * item.quantityPurchased * item.sgstPercentage / 100;
          item.igst = 0;
          // this.billTotal += item.totalSellingPrice;//create a function to calculate bill total
          this.calculateBilltotal();
          console.log(item);
        }
      }
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  // netGST: number = 0;
  totalIgst: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;

  calculateBilltotal() {
    try {
      this.billTotal = 0;
      this.totalCgst = 0;
      this.totalIgst = 0;
      this.totalSgst = 0;
      this.billObj.products.forEach(element => {
        this.billTotal += element.totalSellingPrice;
        this.totalCgst += element.cgst;
        this.totalSgst += element.sgst;
        this.totalIgst += element.igst;
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
      this.totalIgst = 0;
      this.totalSgst = 0;
      this.totalCgst = 0;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Pay() {
    try {
      this.billObj.totalAmount = this.billTotal;
      this.billObj.netGST = this.totalCgst + this.totalIgst + this.totalSgst;
      console.log(this.billObj);
      this.promiseService.post('bill', 'api', this.billObj).then(res => {
        this.snackbarService.openSnackBar("Purchase Successfull", 'Close', 'success-snackbar');
        this.Reset();
      }, err => {
        this.snackbarService.openSnackBar(err.message, 'Close', 'error-snackbar');
      });

    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  stockList: any
  getStockList() {
    try {
      this.promiseService.get('stockReport', 'api').then((res: any) => {
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


  dealerList: any = [];
  getCustomerList() {
    try {
      this.promiseService.get('dealer', 'api').then((res: any) => {
        this.dealerList = res;
        console.log("dealer list", this.dealerList);
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
    if (this.dealerList && value) {
      const filterValue = value.toLowerCase();
      if (value.length > 0)
        return this.dealerList.map(e => e.dealerAgencyName.concat('(', e.dealerUserName, ')')).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.dealerList.map(e => e.dealerAgencyName.concat('(', e.dealerUserName, ')'));
      }
    }
    else {
      // console.log("else");
      return this.dealerList.map(e => e.dealerAgencyName.concat('(', e.dealerUserName, ')'));
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
        pdf.addImage(contentDataURL, 'PNG', 0, 20, imgWidth, imgHeight)
        pdf.save('MYPdf.pdf'); // Generated PDF
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }
}

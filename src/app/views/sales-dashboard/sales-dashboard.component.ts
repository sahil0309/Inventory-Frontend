import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../global/adapters/date.adapter';

import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { AppConfigService } from '../../services/app-config.service';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['dealer_name', 'owner_name', 'purchase_stock', 'total_amount', 'paid_amount', 'remaining', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dataService: DataService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    public dialog: MatDialog) { }

  ngOnInit() {
    try {

      this.getSalesDetails();

      this.getListSales();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  ngAfterViewInit() {
    try {
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
        const value: any = data[sortHeaderId];
        return typeof value === "string" ? value.toLowerCase() : value;
      };
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_sales: any = [];
  getListSales(){
    try{
      this.list_sales = [{
        id: 1,
        productId: 1,
        productName: 'Ambuja Cement',
        categoryId: 1,
        categoryName: 'Cement',
        dealerId: 1,
        dealerName: 'Sai Dealer',
        soldQuantity: 20,
        sellingPrice: 400,
        totalAmount: 8000,
        paidAmount: 7000,
        dueAmount: 1000,
        sellingDate: new Date()
      },{
        id: 2,
        productId: 2,
        productName: 'Ultratech Cement',
        categoryId: 1,
        categoryName: 'Cement',
        dealerId: 2,
        dealerName: 'Om Dealer',
        soldQuantity: 5,
        sellingPrice: 450,
        totalAmount: 2250,
        paidAmount: 2250,
        dueAmount: 0,
        sellingDate: new Date()
      },{
        id: 3,
        productId: 3,
        productName: 'Adidas Shoes',
        categoryId: 2,
        categoryName: 'Shoes',
        dealerId: 3,
        dealerName: 'Adidas Dealer',
        soldQuantity: 5,
        sellingPrice: 2000,
        totalAmount: 10000,
        paidAmount: 9000,
        dueAmount: 1000,
        sellingDate: new Date()
      },{
        id: 4,
        productId: 4,
        productName: 'Nike Shoes',
        categoryId: 2,
        categoryName: 'Shoes',
        dealerId: 4,
        dealerName: 'Nike Dealer',
        soldQuantity: 10,
        sellingPrice: 3000,
        totalAmount: 30000,
        paidAmount: 30000,
        dueAmount: 0,
        sellingDate: new Date()
      }];
    }catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_sales_details: any;
  getSalesDetails() {
    try {

      this.list_sales_details = [{
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Seema Enterprises',
        owner_name: 'Seema Patil',
        purchase_stock: '5 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }, {
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }
      ];

      this.dataSource = new MatTableDataSource(this.list_sales_details);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  editSalesList(item) {
    try {
      console.log(item);
      this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

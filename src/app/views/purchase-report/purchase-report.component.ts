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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dataService: DataService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private toastr: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    try {

      this.getStockList();
    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      this.toastr.error(e.message);
    }
  }

  stock_list: any;
  getStockList() {
    try {

      this.stock_list = [{
        Product_Id: 3,
        Product_Name: 'Ambuja Cement',
        Category_name: 'Cement',
        Quantity: 20,
        dateOfPurchase: new Date(2011, 0, 3),
        Cost_Price: 100,
        Selling_Price: 150
      },
      {
        Product_Id: 1,
        Product_Name: 'Ambuja Cement',
        Category_name: 'Cement',
        Quantity: 20,
        dateOfPurchase: new Date(),
        Cost_Price: 100,
        Selling_Price: 250
      }, {
        Product_Id: 2,
        Product_Name: 'Ultra Tech Cement',
        Category_name: 'Cement',
        Quantity: 20,
        dateOfPurchase: new Date(),
        Cost_Price: 200,
        Selling_Price: 250
      },
      {
        Product_Id: 2,
        Product_Name: 'Ultra Tech Cement',
        Category_name: 'Cement',
        Quantity: 20,
        dateOfPurchase: new Date(2019, 1, 17),
        Cost_Price: 300,
        Selling_Price: 350
      },
      {
        Product_Id: 2,
        Product_Name: 'Ultra Tech Cement',
        Category_name: 'Cement',
        Quantity: 20,
        dateOfPurchase: new Date(2019, 1, 17),
        Cost_Price: 300,
        Selling_Price: 350
      }
      ];
    }
    catch (e) {

    }
  }

  productName: string;
  dateOfPurchase: Date;
  showCards: boolean = false;
  totalStock: number = 0;
  categoryName: string;
  sellingPrice: number;
  productName1: string;
  SearchStock() {
    try {
      console.log(this.stock_list);
      // console.log(this.stock_list[3].dateOfPurchase.getTime(), this.dateOfPurchase.getTime());
      let filterStock: any = [];
      if (this.dateOfPurchase) {
        filterStock = this.stock_list.filter(e => e.Product_Name == this.productName && e.dateOfPurchase.getTime() == this.dateOfPurchase.getTime());
      }
      else {
        filterStock = this.stock_list.filter(e => e.Product_Name == this.productName);
      }
      // console.log(e.Date)
      console.log(filterStock);

      filterStock.forEach(element => {
          this.totalStock += element.Quantity,
          this.categoryName = element.Category_name,
          this.sellingPrice = element.Selling_Price,
          this.productName1 = element.Product_Name
      });
      // console.log(this.productName, this.dateOfPurchase);
      this.showCards = true;
    } catch (e) {
      this.toastr.error(e.message);
    }
  }
}

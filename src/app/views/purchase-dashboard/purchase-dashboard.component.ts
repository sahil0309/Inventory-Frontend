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
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '../../services/app-config.service';
import { PromiseService } from 'src/app/services/promise.service';

const ELEMENT_DATA: any[] = [];


@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.css']
})
export class PurchaseDashboardComponent implements OnInit {

  showTable: boolean = false;
  displayedColumns: string[] = ['SrNo', 'productName', 'categoryName', 'dealerContactPerson', 'quantityPurchased', 'purchaseTimeStamp', 'costPrice','Action'];
  // displayedColumnsWithAction:string[]=['Product_Id', 'Product_Name', 'Category_name', 'Quantity', 'Date', 'Cost_Price', 'Selling_Price','Action'];
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
    private promiseService: PromiseService,
    private toastr: ToastrService,
    public dialog: MatDialog) { }

  ngOnInit() {
    try {

      this.getStockList();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      // this.toastr.error(e.message);
    }
  }

  ngAfterViewInit() {
  }

  list_sales_details: any;
  stock_list: any;
  getStockList() {
    try {

      this.promiseService.get('purchase', 'api').then((res: any) => {
        this.stock_list = res;
        console.log(this.stock_list);
        this.dataSource = new MatTableDataSource(this.stock_list);
        this.showTable = true;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, (err) => {
        this.toastr.error(err.message);
      });
    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      this.toastr.error(e.message);
    }
  }

  onEdit(item) {
    try {
      console.log(item);
      this.router.navigate(["edit-stock", item.purchaseId, { template: 'Edit' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');

    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
      this.toastr.error(e.message);
    }
  }
  onAdd(item) {
    try {
      console.log(item);
      this.router.navigate(["add-stock", { template: 'Add' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
      this.toastr.error(e.message);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

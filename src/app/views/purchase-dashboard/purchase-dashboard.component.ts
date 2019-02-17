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
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.css']
})
export class PurchaseDashboardComponent implements OnInit {

  showTable: boolean = false;
  displayedColumns: string[] = ['Product_Id', 'Product_Name', 'Category_name', 'Quantity', 'Date', 'Cost_Price', 'Selling_Price', 'Action'];
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
    public dialog: MatDialog) { }

  ngOnInit() {
    try {

      this.getSalesDetails();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  ngAfterViewInit() {
  }

  list_sales_details: any;
  getSalesDetails() {
    try {

      this.list_sales_details = [{
        Product_Id: 1,
        Product_Name: 'Ambuja Cement',
        Category_name: 'Cement',
        Quantity: 20,
        Date: new Date(),
        Cost_Price: 100,
        Selling_Price: 150
      },
      {
        Product_Id: 1,
        Product_Name: 'Ambuja Cement',
        Category_name: 'Cement',
        Quantity: 20,
        Date: new Date(),
        Cost_Price: 100,
        Selling_Price: 250
      }, {
        Product_Id: 2,
        Product_Name: 'Ultra Tech Cement',
        Category_name: 'Cement',
        Quantity: 20,
        Date: new Date(),
        Cost_Price: 200,
        Selling_Price: 250
      }
      ];

      this.dataSource = new MatTableDataSource(this.list_sales_details);
      this.showTable = true;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  onEdit(item) {
    try {
      console.log(item);
      this.router.navigate(["edit-material", item.Product_Id, { template: 'Edit' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }
  onAdd(item) {
    try {
      console.log(item);
      this.router.navigate(["add-material", { template: 'Add' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

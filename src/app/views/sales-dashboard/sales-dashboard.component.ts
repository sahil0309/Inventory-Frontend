import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS} from '../../global/adapters/date.adapter';

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

  constructor(private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dataService: DataService,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    public dialog: MatDialog) {}

  ngOnInit() {
    try{

      this.getSalesDetails();
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  ngAfterViewInit(){
    try{
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
        const value: any = data[sortHeaderId];
        return typeof value === "string" ? value.toLowerCase() : value;
      };
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  list_sales_details: any;
  getSalesDetails(){
    try{

      this.list_sales_details = [{
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      },{
        dealer_name: 'Seema Enterprises',
        owner_name: 'Seema Patil',
        purchase_stock: '5 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      },{
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      },{
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      },{
        dealer_name: 'Shree Datta Enterprises',
        owner_name: 'Chetan Shirbhate',
        purchase_stock: '10 items',
        total_amount: 100000,
        paid_amount: 60000,
        remaining: 40000,
      }];

      this.dataSource = new MatTableDataSource(this.list_sales_details);
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

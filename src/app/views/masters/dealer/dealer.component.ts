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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../global/adapters/date.adapter';

import { SnackbarService } from '../../../services/snackbar.service';
import { DataService } from '../../../services/data.service';
import { HttpService } from '../../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '../../../services/app-config.service';
import { PromiseService } from 'src/app/services/promise.service';

const ELEMENT_DATA = [];
@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})

export class DealerComponent implements OnInit {

  showTable: boolean = false;

  displayedColumns: any[] = ['SrNo', 'dealerContactPerson', 'dealerAddress', 'dealerCity', 'dealerEmail', 'dealerAgencyName', 'dealerMobileNumber', 'dealerPhoneNumber', 'dealerPinCode', 'Action'];
  // displayedColumnsWithAction:string[]=['Product_Id', 'Product_Name', 'Category_name', 'Quantity', 'Date', 'Cost_Price', 'Selling_Price','Action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

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
      this.getdealerList();
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  dealerList: any;
  getdealerList() {
    try {
      this.promiseService.get("dealer", "api").then((res: any) => {
        console.log(res);
        // console.log(this.displayedColumns);
        this.dealerList = res;
        this.dataSource = new MatTableDataSource(this.dealerList);
        console.log(this.dataSource);
        this.showTable = true;
      }, (err) => {
        this.toastr.error(err.message);
      })


    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  onEdit(item) {
    try {
      console.log(item);
      this.router.navigate(["edit-dealer", item.dealerId, { template: 'Edit' }]); 
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.toastr.error(e.message);
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }
  onAdd(item) {
    try {
      // console.log(item);
      this.router.navigate(["add-dealer", { template: 'Add' }]);
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

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
import { ToastrService } from 'ngx-toastr'
import { SnackbarService } from '../../../services/snackbar.service';
import { DataService } from '../../../services/data.service';
import { HttpService } from '../../../services/http.service';
import { PromiseService } from '../../../services/promise.service';
import { AppConfigService } from '../../../services/app-config.service';

const ELEMENT_DATA: any[] = [];

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['SrNo', 'categoryName', 'Action'];
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
      this.getCategoryList();
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  ngAfterViewInit() {
  }

  list_sales_details: any;
  getCategoryList() {
    try {
      this.promiseService.get("category", "api").then((res: any) => {
        console.log('Response',res);
        this.list_sales_details = res;
        this.dataSource = new MatTableDataSource(this.list_sales_details);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, (err) => {
        console.log('Error',err);
        this.snackbarService.openSnackBar(err.message, 'Close', 'error-snackbar');
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  onEdit(item) {
    try {
      console.log(item);
      this.router.navigate(["edit-category", item.categoryId, { template: 'Edit' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }
  onAdd() {
    try {
      // console.log(item);
      this.router.navigate(["add-category", { template: 'Add' }]);
      // this.snackbarService.openSnackBar("edit", 'Close', 'error-snackback');
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackback');
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

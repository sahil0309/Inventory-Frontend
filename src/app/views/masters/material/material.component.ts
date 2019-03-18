import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../global/adapters/date.adapter';

import { SnackbarService } from '../../../services/snackbar.service';
import { DataService } from '../../../services/data.service';
import { HttpService } from '../../../services/http.service';
import { PromiseService } from '../../../services/promise.service';
import { AppConfigService } from '../../../services/app-config.service';
import { ToastrService } from 'ngx-toastr'
const ELEMENT_DATA: any[] = [];


@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

  displayedColumns: string[] = ['SrNo', 'productName', 'categoryName', 'Action'];
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
      this.getProductList();

    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      this.toastr.error(e.message);
    }
  }

  ngAfterViewInit() {
    console.log(this.dataSource);
  }

  category_list: any;
  getCategoryList() {
    try {
      this.promiseService.get('category', 'api').then((res: any) => {
        this.category_list = res;
        // console.log(res);
      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  list_sales_details: any;
  product_list: any;
  getProductList() {
    try {
      this.promiseService.get('product', 'api').then((res: any) => {
        this.product_list = res;
        console.log(res);
        if (this.category_list) {
          this.product_list.forEach(element => {
            let categoryObj = this.category_list.filter(e => e.categoryId == element.categoryId)[0];
            element.categoryName = categoryObj.categoryName;
            // console.log(categoryObj);
          });
          // console.log(this.product_list);
          this.dataSource = new MatTableDataSource(this.product_list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.dataSource.sort = this.sort;
        }
      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }


  onEdit(item) {
    try {
      console.log(item);
      this.router.navigate(["edit-material", item.productId, { template: 'Edit' }]);
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

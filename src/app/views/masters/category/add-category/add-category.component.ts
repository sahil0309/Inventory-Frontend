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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../global/adapters/date.adapter';

import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from '../../../../services/snackbar.service';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { PromiseService } from '../../../../services/promise.service';
import { AppConfigService } from '../../../../services/app-config.service';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  categoryId: number;
  template: string = "Add Category";
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

  ngOnInit() {
    this.resetObjCategoryForm();
    this.bindCategoryForm();
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      let templateType = params['template'];
      console.log(templateType);
      if (templateType == 'Edit') {
        this.template = "Edit Category";
        this.getCategoryById(this.categoryId);
      }
      else {
        this.bindCategoryForm();
      }
    });

  }

  getCategoryById(categoryId) {
    try {
      let url = "";
      this.promiseService.get("category/" + categoryId, 'api').then((res: any) => {
        console.log("res", res);
        this.ObjCategoryForm = res;
        this.bindCategoryForm();
      }, (err) => {
        this.snackbarService.openSnackBar(err, 'Close', 'error-snackbar');
      })
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  ObjCategoryForm: any = [];
  resetObjCategoryForm() {
    this.ObjCategoryForm = {
      categoryName: null
    }
  }

  bindCategoryForm() {
    try {
      this.categoryForm = this.formBuilder.group({
        categoryName: [this.ObjCategoryForm.categoryName]
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Save() {
    try {
      console.log(this.categoryForm.value);

      if (this.template !== "Edit Category") {
        this.promiseService.post('category', 'api', this.categoryForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
            this.router.navigate(["category"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
      else {
        let data={
          categoryId:this.categoryId,
          categoryName:this.categoryForm.value.categoryName
        }
        this.promiseService.put('category', 'api', data).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
            this.router.navigate(["category"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
    }
    catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Back() {
    try {
      this.router.navigate(["category"]);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }


}

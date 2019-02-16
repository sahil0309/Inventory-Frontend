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
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      let templateType = params['template'];
      console.log(templateType);
      if (templateType == 'edit') {
        this.getCategoryDetails(this.categoryId);
      }
      else {
        this.bindCategoryForm();
      }
    });

  }

  getCategoryDetails(categoryId) {
    try {
      let url = "";
      this.promiseService.get(url, 'api').then((res: any) => {
        this.ObjCategoryForm = res;
        this.bindCategoryForm();
      }, (err) => {
        this.toastr.error(err);
      })
    } catch (e) {
      this.toastr.error(e.message);
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
      this.toastr.error(e.message);
    }
  }

  saveCategory() {
    try {
      console.log(this.categoryForm.value);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  Back() {
    try {
      this.router.navigate(["category"]);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }


}

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
import { AppConfigService } from '../../../../services/app-config.service';


@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

  productForm: FormGroup;

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

  productId: number;
  template: string;
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.productId = +params["id"];
      this.template = params["template"];
      console.log(this.productId, this.template);
    });
    this.resetObjCategoryForm();
    this.bindProductForm();
  }

  ObjCategoryForm: any = [];
  resetObjCategoryForm() {
    this.ObjCategoryForm = {
      productName: null,
      categoryName: null
    }
  }

  bindProductForm() {
    try {
      this.productForm = this.formBuilder.group({
        productName: [this.ObjCategoryForm.productName],
        categoryName: [this.ObjCategoryForm.categoryName]
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  save() {
    try {
      console.log(this.productForm.value);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  Back() {
    try {
      this.router.navigate(["material"]);
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

}

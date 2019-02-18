import { Component, OnInit, AfterViewInit, TemplateRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSort, MatTableDataSource, Sort, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../global/adapters/date.adapter';

import { ToastrService } from 'ngx-toastr';
import { SnackbarService } from '../../../../services/snackbar.service';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { PromiseService } from '../../../../services/promise.service'
import { AppConfigService } from '../../../../services/app-config.service';


@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

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

  productId: number;
  template: string;
  templateType: string;
  productForm: FormGroup;
  categoryFormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.getCategoryList();
    this.resetObjProductForm();
    this.bindProductForm();

    this.route.params.subscribe(params => {
      this.productId = +params["id"];
      this.template = params["template"];
      // console.log(this.productId, this.template);
      if (this.template == 'Edit') {
        this.templateType = "Edit Product";
        this.getProductDetailsById();
      }
      else {
        this.templateType = "Add Product";
        this.bindProductForm();
      }
    });
  }

  category_list: any;
  getCategoryList() {
    try {
      this.promiseService.get('category', 'api').then((res: any) => {
        this.category_list = res;
        console.log("categoryList", this.category_list);
        // this._filterCategory('');
        this.filteredOptions = this.categoryFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterCategory(value))
          );

      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  private _filterCategory(value: string): string[] {
    const filterValue = value.toLowerCase();
    // console.log('value', filterValue);
    if (this.category_list) {
      if (value.length > 0)
        return this.category_list.map(e => e.categoryName).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.category_list.map(e => e.categoryName)
      }
    }
    // console.log("category list", this.category_list);
  }

  ObjProductForm: any = [];
  resetObjProductForm() {
    this.ObjProductForm = {
      productName: null,
      categoryId: null
    }
  }

  bindProductForm() {
    try {
      this.productForm = this.formBuilder.group({
        productName: [this.ObjProductForm.productName],
        categoryId: [this.ObjProductForm.categoryId]
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  getProductDetailsById() {
    try {
      let url = "product/" + this.productId;
      this.promiseService.get(url, 'api').then((res: any) => {
        this.ObjProductForm = res;
        console.log(res);
        let categoryObj = this.category_list.filter(e => e.categoryId == res.categoryId)[0];
        this.categoryFormControl.patchValue(categoryObj.categoryName);
        this.bindProductForm();
      }, (err) => {
        this.toastr.error(err.statusText);
      })
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  save() {
    try {
      console.log(this.categoryFormControl.value);
      let categoryObj = this.category_list.filter(e => e.categoryName === this.categoryFormControl.value)[0];
      this.productForm.patchValue({
        categoryId: categoryObj.categoryId
      });
      console.log(this.productForm.value);

      if (this.templateType !== "Edit Product") {
        this.promiseService.post('product', 'api', this.productForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["material"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
      else {
        let data = {
          categoryId: this.productForm.value.categoryId,
          productName: this.productForm.value.productName,
          productId: this.productId
        }
        this.promiseService.put('product', 'api', data).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.toastr.success(res.message);
            this.router.navigate(["material"]);
          }
          else
            this.toastr.error(res.message);
        }, (err) => {
          console.log(err);
        });
      }
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

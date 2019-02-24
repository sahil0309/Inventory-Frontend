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
import { MatAutocompleteSelectedEvent } from '@angular/material';
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
    public dialog: MatDialog
  ) { }

  productId: number;
  template: string;
  action: string;
  productForm: FormGroup;
  categoryFormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    try{
      this.getCategoryList();
      this.resetobjProductForm();
      this.bindProductForm();

      this.route.params.subscribe(params => {
        this.productId = +params["id"];
        this.template = params["template"];
        // console.log(this.productId, this.template);
        if (this.template == 'Edit') {
          this.action = "edit";
          this.getProductDetailsById();
        }
        else {
          this.action = "add";
          this.bindProductForm();
        }
      });
    }catch(e){
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  category_list: any;
  getCategoryList() {
    try {
      this.promiseService.get('category', 'api').then((res: any) => {
        this.category_list = res;
        // console.log("categoryList", this.category_list);
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
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  onCategorySelection(event: MatAutocompleteSelectedEvent){
    try{
      console.log(event.option);

      let data = this.category_list.filter(item => item.categoryName.trim().toLowerCase() == event.option.value.trim().toLowerCase());
      // console.log('data', data);

      if(data && data.length > 0){
        this.productForm.patchValue({
          categoryId: data[0].categoryId,
          categoryName: data[0].categoryName,
        })
      }


    }catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
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

  objProductForm: any = [];
  resetobjProductForm() {
    this.objProductForm = {
      productId: 0,
      productName: null,
      categoryId: null,
      categoryName: null
    }
  }

  bindProductForm() {
    try {
      this.productForm = this.formBuilder.group({
        productId: [this.objProductForm.productId, Validators.required],
        productName: [this.objProductForm.productName, Validators.required],
        categoryId: [this.objProductForm.categoryId, Validators.required],
        categoryName: [this.objProductForm.categoryName, Validators.required],
      });
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  getProductDetailsById() {
    try {

      let url = "product/" + this.productId;

      this.promiseService.get(url, 'api').then((res: any) => {
        this.objProductForm = res;

        // console.log('this.objProductForm', this.objProductForm);

        let categoryObj = this.category_list.filter(e => e.categoryId == res.categoryId);
        // console.log('categoryObj', categoryObj);

        if(categoryObj && categoryObj.length > 0){
          this.objProductForm.categoryName = categoryObj[0].categoryName
        }

        // this.categoryFormControl.patchValue(categoryObj.categoryName);

        this.bindProductForm();
      }, (err) => {
        this.snackbarService.openSnackBar(err.statusText, 'Close', 'error-snackbar');
      })
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  save() {
    try {

      console.log('this.productForm.value', this.productForm.value);

      if (this.action !== "edit") {

        this.promiseService.post('product', 'api', this.productForm.value).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
            this.router.navigate(["material"]);
          }
          else{
            this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
          }
        }, (err) => {
          console.log(err);
        });

      }
      else {

        let data = this.productForm.value;

        this.promiseService.put('product', 'api', data).then((res: any) => {
          console.log("res", res);
          if (res.status !== 'error') {
            this.snackbarService.openSnackBar(res.message, 'Close', 'success-snackbar');
            this.router.navigate(["material"]);
          }
          else{
            // this.toastr.error(res.message);
            this.snackbarService.openSnackBar(res.message, 'Close', 'error-snackbar');
          }
        }, (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(err, 'Close', 'error-snackbar');
        });
      }
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

  Back() {
    try {
      this.router.navigate(["material"]);
    } catch (e) {
      this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
    }
  }

}

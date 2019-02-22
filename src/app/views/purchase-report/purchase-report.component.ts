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
import { AppDateAdapter, APP_DATE_FORMATS } from '../../global/adapters/date.adapter';

import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { AppConfigService } from '../../services/app-config.service';
import { ToastrService } from 'ngx-toastr';
import { PromiseService } from 'src/app/services/promise.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

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


  productFormControl = new FormControl();
  // filteredCategoryOptions: Observable<string[]>;
  filteredProductOptions: Observable<string[]>;

  ngOnInit() {
    try {
      this.getProductList();
      this.getStockList();
    } catch (e) {
      // this.snackbarService.openSnackBar(e.message, 'Close', 'error-snackbar');
      this.toastr.error(e.message);
    }
  }

  stock_list: any;
  getStockList() {
    try {

      this.promiseService.get('stockReport', 'api').then((res: any) => {
        this.stock_list = res;
        console.log(this.stock_list);
      }, (err) => {
        this.toastr.error(err.message);
      })
      // this.stock_list = [{
      //   Product_Id: 3,
      //   Product_Name: 'Ambuja Cement',
      //   Category_name: 'Cement',
      //   Quantity: 20,
      //   dateOfPurchase: new Date(2011, 0, 3),
      //   QunatityInHand: 10,
      //   Cost_Price: 100,
      //   Selling_Price: 150
      // },
      // {
      //   Product_Id: 1,
      //   Product_Name: 'Ambuja Cement',
      //   Category_name: 'Cement',
      //   Quantity: 20,
      //   dateOfPurchase: new Date(),
      //   Cost_Price: 100,
      //   Selling_Price: 250
      // }, {
      //   Product_Id: 2,
      //   Product_Name: 'Ultra Tech Cement',
      //   Category_name: 'Cement',
      //   Quantity: 20,
      //   dateOfPurchase: new Date(),
      //   Cost_Price: 200,
      //   Selling_Price: 250
      // },
      // {
      //   Product_Id: 2,
      //   Product_Name: 'Ultra Tech Cement',
      //   Category_name: 'Cement',
      //   Quantity: 20,
      //   dateOfPurchase: new Date(2019, 1, 17),
      //   Cost_Price: 300,
      //   Selling_Price: 350
      // },
      // {
      //   Product_Id: 2,
      //   Product_Name: 'Ultra Tech Cement',
      //   Category_name: 'Cement',
      //   Quantity: 20,
      //   dateOfPurchase: new Date(2019, 1, 17),
      //   Cost_Price: 300,
      //   Selling_Price: 350
      // }
      // ];
    }
    catch (e) {

    }
  }

  productName: string;
  dateOfPurchase: Date;
  showCards: boolean = false;
  totalStock: number = 0;
  categoryName: string;
  sellingPrice: number;
  productName1: string;
  stockReportArray: any = [];
  toggle: boolean = false;
  SearchStock() {
    try {
      console.log(this.stock_list);
      // console.log(this.stock_list[3].dateOfPurchase.getTime(), this.dateOfPurchase.getTime());
      this.stockReportArray = [];
      let filterStock: any = [];
      // this.toggle = true;
      if (this.toggle) {
        this.stockReportArray = this.stock_list;
        // const distinct = (value, index, self) => {
        //   return self.indexOf(value) === index;
        // };

        // let productNames = this.stock_list.map(e => e.Product_Name);
        // let distinctproductNames = productNames.filter(distinct);
        // console.log(distinctproductNames);

        // distinctproductNames.forEach(pName => {
        //   let totalStock = 0;
        //   this.stock_list.forEach(e => {
        //     if (e.Product_Name === pName) {
        //       totalStock += e.Quantity;
        //       this.productName1 = e.Product_Name;
        //       this.categoryName = e.Category_name;
        //       this.sellingPrice = e.Selling_Price;
        //     }
        //   });
        //   this.stockReportArray.push({
        //     totalStock: totalStock,
        //     categoryName: this.categoryName,
        //     sellingPrice: this.sellingPrice,
        //     productName: this.productName1
        //   });
        // });
      }
      else {
        filterStock = this.stock_list.filter(e => e.productName == this.productFormControl.value);
        console.log(filterStock);
        this.stockReportArray = [];
        this.stockReportArray = filterStock;
        console.log(this.stockReportArray);
        // this.stockReportArray.push({
        //   categoryName: filterStock[0].categoryName,
        //   sellingPrice: filterStock[0].sellingPrice,
        //   productName: filterStock[0].productName,
        //   quantity: filterStock[0].quantity,
        //   quantityAvailable: filterStock[0].quantityAvailable,
        //   lastPurchased: filterStock[0].lastPurchased
        // })
        // console.log(e.Date)
        //   console.log("length", filterStock.length);

        //   // let totalStock;
        //   filterStock.forEach(element => {
        //     this.totalStock += element.Quantity
        //   });

        //   let length = filterStock.length;
        //   this.stockReportArray.push({
        //     categoryName: filterStock[length - 1].Category_name,
        //     sellingPrice: filterStock[length - 1].Selling_Price,
        //     productName: filterStock[length - 1].Product_Name,
        //     totalStock: this.totalStock
        //   })
        // }
      }
      console.log(this.stockReportArray);
      this.showCards = true;
    } catch (e) {
      this.toastr.error(e.message);
    }
  }


  product_list: any
  getProductList() {
    try {
      this.promiseService.get('product', 'api').then((res: any) => {
        this.product_list = res;
        console.log("productList", this.product_list);
        // this._filterCategory('');  
        this.filteredProductOptions = this.productFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterProduct(value))
          );

      }, err => {
        this.toastr.error(err.message)
      });
    } catch (e) {
      this.toastr.error(e.message);
    }
  }

  private _filterProduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    // console.log('value', filterValue);
    if (this.product_list) {
      if (value.length > 0)
        return this.product_list.map(e => e.productName).filter(option => option.toLowerCase().includes(filterValue));
      else {
        // console.log("else");
        return this.product_list.map(e => e.productName)
      }
    }
    // console.log("category list", this.category_list);
  }


  toggleChange() {
    try {
      console.log("change");
      if (this.toggle)
        this.SearchStock();
      else
        this.stockReportArray = [];
    } catch (e) {
      this.toastr.error(e.message);
    }
  }
}

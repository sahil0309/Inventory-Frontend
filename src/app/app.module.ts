import { BrowserModule } from '@angular/platform-browser';
import { forwardRef, Injectable, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'

import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';

// Routing modules
import { AppRoutingModule } from './/app-routing.module';
// Add bootstrap modules
import { AppBootstrapModule } from './app-bootstrap/app-bootstrap.module';
// Add bootstrap modules
import { AppMaterialModule } from './app-material/app-material.module';
// Add toastr modules
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';

// Filter pipe
import { FilterPipe } from './global/filter.pipe';

// File upload
// import { AngularFileUploaderModule } from "angular-file-uploader";
import { HeaderComponent } from './views/layout/header/header.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { SalesDashboardComponent } from './views/sales-dashboard/sales-dashboard.component';
import { UserListComponent } from './views/masters/user/user-list/user-list.component';
import { UserProfileComponent } from './views/masters/user/user-profile/user-profile.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CategoryComponent } from './views/masters/category/category.component';
import { MaterialComponent } from './views/masters/material/material.component';
import { AddCategoryComponent } from './views/masters/category/add-category/add-category.component';
// import { AddProductComponent } from './views/masters/add-product/add-product.component';
import { AddMaterialComponent } from './views/masters/material/add-material/add-material.component';
import { PurchaseDashboardComponent } from './views/purchase-dashboard/purchase-dashboard.component';
// import { SalesReportComponent } from './views/sales-report/sales-report.component';
import { PurchaseReportComponent } from './views/purchase-report/purchase-report.component';
import { AddStockComponent } from './views/purchase-dashboard/add-stock/add-stock.component';
import { DealerComponent } from './views/masters/dealer/dealer.component';
import { AddDealerComponent } from './views/masters/dealer/add-dealer/add-dealer.component';
import { BillComponent } from './views/bill/bill.component';

@NgModule({
  declarations: [
    AppComponent, LoginComponent, DashboardComponent, HeaderComponent, SalesDashboardComponent,
    UserListComponent, UserProfileComponent, ChangePasswordComponent, CategoryComponent, MaterialComponent, AddCategoryComponent, AddMaterialComponent, PurchaseDashboardComponent, PurchaseReportComponent, AddStockComponent, DealerComponent, AddDealerComponent, BillComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule, AppBootstrapModule, AppMaterialModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    // AngularFileUploaderModule,
    FileUploadModule
  ],
  providers: [DatePipe, AuthService, AuthGuard],
  // providers: [ DatePipe, forwardRef(() => AuthService), forwardRef(() => AuthGuard) ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: []
})
export class AppModule { }

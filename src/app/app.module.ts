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

@NgModule({
  declarations: [
    AppComponent, LoginComponent, DashboardComponent, HeaderComponent, SalesDashboardComponent,
    UserListComponent, UserProfileComponent, ChangePasswordComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule, AppBootstrapModule, AppMaterialModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    // AngularFileUploaderModule,
    FileUploadModule
  ],
  providers: [ DatePipe, AuthService, AuthGuard ],
  // providers: [ DatePipe, forwardRef(() => AuthService), forwardRef(() => AuthGuard) ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: []
})
export class AppModule { }

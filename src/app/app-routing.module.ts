import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
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
import { AuthGuard } from './services/auth.guard';

import { PurchaseDashboardComponent } from './views/purchase-dashboard/purchase-dashboard.component';
import { PurchaseReportComponent } from './views/purchase-report/purchase-report.component';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { AddStockComponent } from './views/purchase-dashboard/add-stock/add-stock.component';
import { DealerComponent } from './views/masters/dealer/dealer.component';
import { AddDealerComponent } from './views/masters/dealer/add-dealer/add-dealer.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent, pathMatch: "full" },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales-dashboard', component: SalesDashboardComponent },
  { path: 'purchase-dashboard', component: PurchaseDashboardComponent },

  { path: 'add-stock', component: AddStockComponent },
  { path: 'edit-stock/:id', component: AddStockComponent },

  { path: 'category', component: CategoryComponent },
  { path: 'material', component: MaterialComponent },

  { path: 'add-material', component: AddMaterialComponent },
  { path: 'edit-material/:id', component: AddMaterialComponent },

  { path: 'add-category', component: AddCategoryComponent },
  { path: 'edit-category/:id', component: AddCategoryComponent },

  { path: 'dealer-list', component: DealerComponent },
  { path: 'add-dealer', component: AddDealerComponent },
  { path: 'edit-dealer/:id', component: AddDealerComponent },

  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'purchase-report', component: PurchaseReportComponent },

  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },

  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      enableTracing: false, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategyService,
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

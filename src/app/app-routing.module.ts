import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";
import { ProductListComponent } from './product-list/product-list.component';
import {ProductDetailsComponent} from "./product-details/product-details.component";
import {ProfileComponent} from "./profile/profile.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PaymentOptionComponent} from "./payment-option/payment-option.component";

const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {path:'login',component:LoginComponent},
  {path:'new-user',component:NewUserComponent},
  {path:'category/:id/products',
    component:ProductListComponent,
  },
  {path:'category-id/:id/product-sku/:sku',component:ProductDetailsComponent},
  {path:'profile',component:ProfileComponent},
  {path:'dashboard',component:DashboardComponent},
  {
    path:'payment-option',component:PaymentOptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

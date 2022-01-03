import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {path:'login',component:LoginComponent},
  {path:'new-user',component:NewUserComponent},
{
    path:'category/:id/products',
    component:ProductListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

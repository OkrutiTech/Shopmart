import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {InputTextModule} from 'primeng/inputtext';
import { SkeletonModule } from "primeng/skeleton";
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MenubarModule } from 'primeng/menubar';
import { ProductListComponent } from './product-list/product-list.component';
import { CardModule, } from 'primeng/card';
import {HttpClientModule} from "@angular/common/http"


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductListComponent
  ],
  imports: [
    InputTextModule,
    BrowserModule,
    AppRoutingModule,
    SkeletonModule,
    ButtonModule,
    MenubarModule,
    CardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

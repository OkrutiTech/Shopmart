import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {InputTextModule} from 'primeng/inputtext';
import { SkeletonModule } from "primeng/skeleton";
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './new-user/new-user.component';
import { MenubarModule } from 'primeng/menubar';
import { ProductListComponent } from './product-list/product-list.component';
import { CardModule, } from 'primeng/card';
import {HttpClientModule} from "@angular/common/http"
import { AvatarModule } from "primeng/avatar";
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { PanelModule } from "primeng/panel";
import { RippleModule } from "primeng/ripple";
import { PanelMenuModule } from 'primeng/panelmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {BadgeModule} from 'primeng/badge';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CookiesService} from "./shared/cookie.service";
import {ProductDetailsComponent} from './product-details/product-details.component';
import {CarouselModule} from 'primeng/carousel';
import {ProductDetailsService} from "./product-details/product-details.service";
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItemContent} from "primeng/menu";
import {TabViewModule} from 'primeng/tabview';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    NewUserComponent,
    ProductListComponent,
    ProductDetailsComponent,
  ],
  imports: [
    MessagesModule,
    MessageModule,
    InputTextModule,
    BrowserModule,
    AppRoutingModule,
    SkeletonModule,
    ButtonModule,
    MenubarModule,
    CardModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AvatarModule,
    BreadcrumbModule,
    PanelModule,
    RippleModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    CardModule,
    BadgeModule,
    CarouselModule,
    ProgressSpinnerModule,
    TabMenuModule,
    TabViewModule


  ],
  providers: [CookieService],
  bootstrap: [AppComponent],

})
export class AppModule { }

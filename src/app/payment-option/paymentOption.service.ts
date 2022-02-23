import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class PaymentOptionService {
  private categories=[];
  constructor(
    private http:HttpClient,
    private cookieService:CookieService
    ) {}
  private userName="";
  getPaymentMethod(){
    let tokenData=this.cookieService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData)
    let url="/cart-backend/rest/default/V1/carts/mine/payment-methods"
    return this.http.get(url,{headers:headers})
  }
}

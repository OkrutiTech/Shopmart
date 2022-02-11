import { Injectable } from '@angular/core';
import {HttpClient , HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private putCustomerUrl = '/cart-backend/rest/V1/customers/me';
  private changePasswordurl = '/cart-backend/rest/V1/customers/me/password';
  private cartItemCount;
  constructor(private _http: HttpClient,private cookiesService:CookieService){}

  PutAccountInformation(customerData) {
    let tokenData=this.cookiesService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    return this._http.put(this.putCustomerUrl,customerData,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }

  changePassword(customerPassword) {
    let tokenData=this.cookiesService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    return this._http.put(this.changePasswordurl,customerPassword,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }
  // private handleError(error: Response) {
  //   //console.error(error);
  //   return Observable.throw(error.json());
  // }

}

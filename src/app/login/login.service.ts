import { Injectable } from '@angular/core';
// import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {HttpClient,HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient){}
  getCustomerToken(user) {
    let url='/cart-backend/rest/V1/integration/customer/token';
    return this.http.post(url,user);
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }

  getCustomerDetail(tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
   let url='/cart-backend/rest/V1/customers/me';
    return this.http.get(url,{headers:headers});
      // .map((response: Response) => response.json())
      // .catch(this.handleError);
  }
  private handleError(error: Response) {
    //console.error(error);
    // return Observable.throw(error.json());
  }
}


import {Injectable, Input} from '@angular/core';
import {HttpClient,HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  constructor(private http:HttpClient) {}

validateEmail(payload:any)
{
  let url='/cart-backend/rest/V1/customers/isEmailAvailable';
  return this.http.post(url,payload);
}
signUp(payload:any){
    let url='/cart-backend/rest/V1/customers'
  return this.http.post(url,payload);
}
  getCustomerToken(user:any){

    let url='/cart-backend/rest/V1/integration/customer/token'
    return this.http.post(url,user)
  }
  customerCartCreate(tokenData:any){
    let url='/cart-backend/rest/V1/carts/mine'
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    return this.http.post(url,null, {headers:headers})
  }
}

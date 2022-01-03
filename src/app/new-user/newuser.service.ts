import {Injectable, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";

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
    let url='/cart-backend/rest/V1/customers/'
  return this.http.post(url,payload);
}
}

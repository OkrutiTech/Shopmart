import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private categories=[];
  constructor(private http:HttpClient) {}
  private userName="";
  getData(){
    let url="/cart-backend/rest/V1/categories"
    return this.http.get(url)
  }
  setValue(val:any) {
    this.categories = val;
  }

  getValue() {
    return this.categories ;
  }
  setUserName(val) {
    this.userName = val;
  }

  getUserName() {
    return this.userName ;
  }
}

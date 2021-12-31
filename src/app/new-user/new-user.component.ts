import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NewUserService} from "./newuser.service";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
signUpFrom={
  firstname:"",
  lastname:'',
  email:'',
  password:''
}
  constructor(private http:HttpClient) { }

  ngOnInit(): void {

  }
  onSubmit(){
  console.log(this.signUpFrom);
    let url="192.168.1.11/cart-backend/rest/V1/customers/";
    return this.http.post(url,this.signUpFrom).subscribe((result)=>{
      console.log(result);
    });
  }
  validateEmail(val:any)
  {

  }
  setData(){

  }
}

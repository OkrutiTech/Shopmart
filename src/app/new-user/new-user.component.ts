import { Component, OnInit } from '@angular/core';
import {NewUserService} from "./newuser.service";
import {CookiesService} from "../shared/cookie.service";
import { CookieService } from 'ngx-cookie-service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  providers:[MessageService]
})
export class NewUserComponent implements OnInit {
  signUpFrom: FormGroup;
  submitted = false;
emailStatus:boolean=false;
formControlStatus:any;
  createCustomer="";
  constructor(private formBuilder: FormBuilder,private newUserService:NewUserService,private _router: Router,,private cookieService:CookieService,private messageService:MessageService) {}

  ngOnInit(): void {
    this.signUpFrom = this.formBuilder.group(
      {
        firstname: ['',[ Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)]],
        lastname: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email
        ,Validators.minLength(8),Validators.maxLength
          (30)
        ]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")
          ]
        ]
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signUpFrom.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    // let signUp={""}
    if (this.signUpFrom.invalid) {
      return;
    }
    console.log(JSON.stringify(this.signUpFrom.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.signUpFrom.reset();
  }
  validateEmail(){
    if(this.signUpFrom.controls.email.valid){
      let emailData = {"customerEmail": this.signUpFrom.controls.email.value};
      this.newUserService.validateEmail(emailData).subscribe(
        (emailExists:any)=> {
         this.emailStatus=emailExists;
         console.log(this.emailStatus)
        }
      )
    }
  }
  createCustomerAccount() {
    if (this.signUpFrom.controls.email && !this.signUpFrom.controls.emailExists) {
      this.createCustomer="Creating customer";
      let customerData = {
        "customer": {
          "email": this.signUpFrom.controls.email.value,
          "firstname": this.signUpFrom.controls.firstname.value,
          "lastname": this.signUpFrom.controls.lastname.value,
          "storeId": 1,
          "websiteId": 1
        },
        "password": this.signUpFrom.controls.password.value,
      };

      this.newUserService.signUp(customerData)
        .subscribe(
          customer => {

            this.cookieService.set('customerDetail',JSON.stringify(customer));
            let user = {
              username: customerData.customer.email,
              password: customerData.password
            };
            this.newUserService.getCustomerToken(user)
              .subscribe(
                token => {
                  this.cookieService.set('customerToken', "Bearer " + token);
                 let tokenData=this.cookieService.get('customerToken');
                  tokenData="Bearer " + token;
                  this.createCustomer="Creating customer cart";
                  this.messageService.add({severity:'success', summary:'Customer', detail:'Create customer Successfully'});

                  // this.toastr.success("Create customer Successfully");
                  this.newUserService.customerCartCreate(tokenData)
                    .subscribe(
                      cart => {
                        //console.log(cart);
                        this.messageService.add({severity:'success', summary:'Customer', detail:'Customer cart created Successfully"'});

                        // this.toastr.success("customer cart created Successfully");

                        this._router.navigate(['']);
                      },
                      error => {
                      //   this.toastr.error(error.message);
                        // this.toastr.error(error.message);
                        this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
                      }
                    );
                },
                error => {
                //   this.toastr.error(error.message);
                  this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
                }
              );
          },
          error => {
          //   this.toastr.error(error.message);
            this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
          }
        );

    }


  }

}






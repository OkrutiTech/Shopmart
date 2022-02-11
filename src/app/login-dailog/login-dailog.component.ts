import { Component,Injectable, OnInit,Input } from '@angular/core';
import {CartService} from "../cart/cart.service";
import {MessageService} from "primeng/api";
import {ConfirmationService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Router} from '@angular/router'
import {LoginService} from "../login/login.service";
import * as _ from 'underscore'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {CookieService} from "ngx-cookie-service";
import {AddtocardComponent} from "../addtocard/addtocard.component";

@Component({
  selector: 'app-login-dailog',
  templateUrl: './login-dailog.component.html',
  styleUrls: ['./login-dailog.component.scss'],
  styles: [`
    :host ::ng-deep .p-button {
      margin: 0 .5rem 0 0;
      min-width: 10rem;
    }

    p {
      margin: 0;
    }

    .confirmation-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .p-dialog .p-button {
      min-width: 6rem;
    }
  `],
  providers: [ConfirmationService]
})
export class LoginDailogComponent implements OnInit {
  position: string;
  logInForm:FormGroup;
  submitted = false;
  loading:string;
  constructor(private formBuilder: FormBuilder,private cartService:CartService,private messageService:MessageService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig,private router:Router,private logInService:LoginService,private cookiesService:CookieService,private addtoCart:AddtocardComponent) {

  }
  error:string;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.logInForm = this.formBuilder.group(
      {
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
    return this.logInForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.logInForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.logInForm.value, null, 2));
  }

  customerLogin() {
    if (this.logInForm.controls.email.invalid || this.logInForm.controls.password.invalid) {
      return;
    }
    this.loading="Validate Credentials";
    let user = {
      username: this.logInForm.controls.email.value,
      password: this.logInForm.controls.password.value
    };
    let tokenData='';
    this.logInService.getCustomerToken(user)
      .subscribe(
        token => {
          this.cookiesService.set('customerToken', "Bearer " + token);
          tokenData="Bearer " + token;
          // this._cookie.get('customerToken');
          this.messageService.add({severity:'success', summary:'Login', detail:'Login customer Successfully'});

          // this.toastr.success("Login customer Successfully");
          this.loading="Loading Customer";
          this.logInService.getCustomerDetail(tokenData)
            .subscribe(
              customer => {
                this.cookiesService.set('customerDetail', JSON.stringify(customer));
                this.messageService.add({severity:'success', summary:'Customer', detail:'Customer details loaded Successfully'});

                // this.toastr.success("customer loaded Successfully");
                this.loading="Loading customer cart";
                this.cartService.getCustomerCartDetail().subscribe((cart:any)=>{
                    let cartData = {
                      itemsCount: cart.items_count
                      // itemsCount: cart,

                    };
                    this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
                    this.cartService.setCartItemCount(cartData.itemsCount);
                    this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart loaded Successfully'});
                    this.addtoCart.showDialog()
                  })
                  // .subscribe(
                  //   (cart:any) => {
                  //     let cartData = {
                  //       itemsCount: cart.items_count
                  //       // itemsCount: cart,
                  //
                  //     };
                  //     this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
                  //     this.cartService.setCartItemCount(cartData.itemsCount);
                  //     this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart loaded Successfully'});
                  //
                  //     // this.toastr.success("customer cart loaded Successfully");
                  //     this.addtoCart.showDialog()
                  //   },
                  //   error => {
                  //     this.loading="";
                  //     this.router.navigate(['login']);
                  //     // this.toastr.error(error.message);
                  //
                  //   }
                  // );
              },
              error => {
                this.loading="";
                this.router.navigate(['login']);
                // this.toastr.error(error.message);
                this.messageService.add({severity:'error', summary:'Cart', detail:'Customer cart loaded Failed'});
              }
            );
        },
        error => {
          this.loading="";
          this.router.navigate(['login']);
          // this.toastr.error(error.message);
          this.messageService.add({severity:'info', summary:'Login', detail:'Check Email && Password'});
        }
      );
  }

  onReset(): void {
    this.submitted = false;
    this.logInForm.reset();
  }

}

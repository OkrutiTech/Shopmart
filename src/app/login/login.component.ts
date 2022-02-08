import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
}from '@angular/forms';
import {LoginService} from "./login.service";
import {CartService} from "../cart/cart.service";
import {MessageService} from "primeng/api";
import {UserMessageService} from "../user-message.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  submitted = false;
  loading:string;
  constructor(private router: Router,private formBuilder:FormBuilder,private logInService:LoginService,private cartService:CartService,private cookiesService:CookieService,private messageService:MessageService,private userMessageService:UserMessageService) { }


  ngOnInit(): void {
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
            // this.cookiesService.get('customerToken');
          // this.messageService.add({severity:'success', summary:'Login', detail:'Login customer Successfully'});

          // this.toastr.success("Login customer Successfully");
          this.loading="Loading Customer";
          this.logInService.getCustomerDetail(tokenData)
            .subscribe(
              customer => {
                this.cookiesService.set('customerDetail', JSON.stringify(customer));
                // this.messageService.add({severity:'success', summary:'Customer', detail:'Customer details loaded Successfully'});

                // this.toastr.success("customer loaded Successfully");
                this.loading="Loading customer cart";
                this.cartService.getCustomerCartDetail(tokenData)
                  .then((cart:any)=>{
                    let cartData = {
                            itemsCount: cart.items_count
                            // itemsCount: cart,

                          };
                          this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
                          this.cartService.setCartItemCount(cartData.itemsCount);
                          this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart loaded Successfully'});

                          // this.toastr.success("customer cart loaded Successfully");
                          this.sendMessage(true);
                          this.router.navigate(['']);
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
                  //     this.sendMessage(true);
                  //     this.router.navigate(['']);
                  //   },
                  //   error => {
                  //     this.loading="";
                  //     this.router.navigate(['login']);
                  //     // this.toastr.error(error.message);
                  //     this.messageService.add({severity:'error',summary:'Cart',detail:'Customer Cart loaded faiiled'})
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
  navigateToSignUp(){
    this.router.navigateByUrl('/new-user');
  }

  sendMessage(data:boolean){
    this.userMessageService.sendUserMessage(data)
  }
}

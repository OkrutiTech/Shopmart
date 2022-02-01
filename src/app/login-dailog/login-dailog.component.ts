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
  // addToCartFrom: FormGroup;
  constructor(private formBuilder: FormBuilder,private cartService:CartService,private messageService:MessageService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig,private router:Router,private logInService:LoginService) {

  }
  error:string;
  mediaImage:string;
  addToCartShow:boolean;
  validateProduct:boolean;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // this.addToCartFrom = this.formBuilder.group(
    //   {
    //     qty: [1,Validators.required]
    //   },
    // );

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
    // let signUp={""}
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
          // this._cookie.put('customerToken', "Bearer " + token);
          tokenData="Bearer " + token;
          // this._cookie.get('customerToken');
          this.messageService.add({severity:'success', summary:'Login', detail:'Login customer Successfully'});

          // this.toastr.success("Login customer Successfully");
          this.loading="Loading Customer";
          this.logInService.getCustomerDetail(tokenData)
            .subscribe(
              customer => {
                // this._cookie.put('customerDetail', JSON.stringify(customer));
                this.messageService.add({severity:'success', summary:'Customer', detail:'Customer details loaded Successfully'});

                // this.toastr.success("customer loaded Successfully");
                this.loading="Loading customer cart";
                this.cartService.getCustomerCartDetail(tokenData)
                  .subscribe(
                    (cart:any) => {
                      let cartData = {
                        itemsCount: cart.items_count
                        // itemsCount: cart,

                      };
                      // this._cookie.put('customerCartCount', JSON.stringify(cartData));
                      this.cartService.setCartItemCount(cartData.itemsCount);
                      this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart loaded Successfully'});

                      // this.toastr.success("customer cart loaded Successfully");
                      this.router.navigate(['']);
                    },
                    error => {
                      this.loading="";
                      this.router.navigate(['login']);
                      // this.toastr.error(error.message);

                    }
                  );
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


  showDialog(){
    this.addToCartShow=!this.addToCartShow;
    // setTimeout(()=>{
    //   if(this.color && this.color.value){
    //     this.getMediaImage(this.product,this.color,this.product.colors)
    //
    //   }
    //   if(this.size && this.size.value){
    //     this.selectSize(this.product,this.size,this.product.sizes)
    //
    //   }
    // }, 3000);

  }
  validateThenAddToCart(){
  //   let response = this.cartService.validateCart(this.product, this.color, this.size,this.addToCartFrom.controls.qty.value);
  //
  //   if (response && response.error) {
  //     this.error = response.error;
  //     return;
  //   }
  //   this.addToCart();
  }

  // addToCart() {
  //
  //   this.validateProduct=true;
  //
  //   let productSku = this.product.sku;
  //
  //   if (this.size) {
  //     productSku = productSku + "-" + this.size.label;
  //   }
  //
  //   if (this.color) {
  //     productSku = productSku + "-" + this.color.label;
  //   }
  //   this.cartService.quoteId().subscribe(
  //     quoteId => {
  //       let cartItem = {
  //         "cart_item": {
  //           "quote_id": quoteId,
  //           "sku": productSku,
  //           "qty": this.addToCartFrom.controls.qty.value
  //         }
  //       };
  //       return this.cartService.addCartItem(cartItem).subscribe(
  //         cartItem => {
  //           this.messageService.add({severity:'success', summary:'Cart', detail:'"Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty'});
  //
  //           // this.toastr.success("Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty);
  //           let getCartItemCount = this.cartService.getCartItemCount();
  //           let setCartItemCount = !getCartItemCount||getCartItemCount===null? 1: getCartItemCount + 1;
  //           this.cartService.setCartItemCount(setCartItemCount);
  //           let cartData = {
  //             itemsCount: setCartItemCount
  //           };
  //           // this._cookie.put('customerCartCount', JSON.stringify(cartData));
  //           this.validateProduct=false;
  //           this.addToCartShow=false;
  //           return {cartItem: cartItem};
  //         },
  //         error => {
  //           return {error: "Please select qty."};
  //         });
  //     },
  //     error => {
  //       return {error: "Please select qty."};
  //     });
  //   // this.toastr.success("done");
  //   this.messageService.add({severity:'success', summary:'done'});
  //
  // }
  getColor(color: any) {
  //   if (color) {
  //     return color;
  //   } else {
  //     return "";
  //   }
  }

  getMediaImage(product: any, color: any, productsColors: any) {
  //   this.mediaImage = "LoadingImage";
  //   let sku = product.sku;
  //   let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
  //   if (color.value) {
  //     this.color = color;
  //     let item = _.findWhere(skuProducts.items, {'color': this.color.value});
  //     if (item) {
  //       product.image = item.image;
  //     }
  //     _.each(productsColors, (color: any) => {
  //       if (color.value === this.color.value) {
  //         // @ts-ignore
  //         document.getElementById("colorBoxAddToCart_" + color.value + product.sku).className = "selected-color";
  //       } else {
  //         // @ts-ignore
  //         document.getElementById("colorBoxAddToCart_" + color.value + product.sku).className = "unselected-color";
  //       }
  //
  //     });
  //     this.mediaImage = "";
  //   }
  }

  selectSize(product: any, size: any, productsSizes: any) {
  //   if (!product) {
  //     return;
  //
  //   }
  //   if (!size) {
  //     return;
  //   }
  //   if (size.value) {
  //     this.size = size;
  //
  //     _.each(productsSizes, (size: any) => {
  //       if (size.value === this.size.value) {
  //         // @ts-ignore
  //         document.getElementById("sizeBoxAddToCart_" + size.value + product.sku).className = "selected-size";
  //       } else {
  //         // @ts-ignore
  //         document.getElementById("sizeBoxAddToCart_" + size.value + product.sku).className = "unselected-size";
  //       }
  //
  //     });
  //   }
  }

}

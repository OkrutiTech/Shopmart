import { Component,Injectable, OnInit,Input } from '@angular/core';
import {CartService} from "../cart/cart.service";
import {MessageService} from "primeng/api";
import {ConfirmationService} from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

import * as _ from 'underscore'
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {CookieService} from "ngx-cookie-service";
import {UserMessageService} from "../user-message.service";

@Component({
  selector: 'app-addtocard',
  templateUrl: './addtocard.component.html',
  styleUrls: ['./addtocard.component.scss'],
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
export class AddtocardComponent implements OnInit {
  @Input() product:any
  @Input() size:any
  @Input() color:any
  @Input() allProducts:any
  loginShowPopup:boolean=false
  msgs: Message[] = [];
  position: string;
  addToCartFrom: FormGroup;
  customerToken:any
  constructor(private formBuilder: FormBuilder,private cartService:CartService,private messageService:MessageService,private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig,private cookiesService:CookieService,private userMessageService:UserMessageService) {
  }
  error:string;
  mediaImage:string;
  addToCartShow:boolean;
  validateProduct:boolean;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.addToCartFrom = this.formBuilder.group(
      {
        qty: [1,Validators.required]
      },
    );
  }
  showDialog(){
     let customerToken=this.cookiesService.get('customerToken')
    this.customerToken=customerToken
    if(customerToken){
      this.addToCartShow=!this.addToCartShow;
      this.sendMessage(true)
      this.loginShowPopup=false
      setTimeout(()=>{
        if(this.color && this.color.value){
          this.getMediaImage(this.product,this.color,this.product.colors)

        }
        if(this.size && this.size.value){
          this.selectSize(this.product,this.size,this.product.sizes)

        }
      }, 3000);
    }
    else{
        this.addToCartShow=false;
        this.loginShowPopup=!this.loginShowPopup
    }
  }
  sendMessage(data:boolean){
    this.userMessageService.sendUserMessage(data)
  }
  validateThenAddToCart(){
    let response = this.cartService.validateCart(this.product, this.color, this.size,this.addToCartFrom.controls.qty.value);
     console.log(this.addToCartFrom.controls.qty.value)
    if (response && response.error) {
      this.error = response.error;
      return;
    }
    this.addToCart();
  }

  addToCart() {

    this.validateProduct=true;

    let productSku = this.product.sku;

    if (this.size) {
      productSku = productSku + "-" + this.size.label;
    }

    if (this.color) {
      productSku = productSku + "-" + this.color.label;
    }
    this.cartService.quoteId(this.customerToken).subscribe(
      quoteId => {
        let cartItem = {
          "cart_item": {
            "quote_id": quoteId,
            "sku": productSku,
            "qty": this.addToCartFrom.controls.qty.value
          }
        };
        return this.cartService.addCartItem(cartItem,this.customerToken).subscribe(
          cartItem => {
            this.messageService.add({severity:'success', summary:'Cart', detail:'"Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty'});

            // this.toastr.success("Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty);
            let getCartItemCount = this.cartService.getCartItemCount();
            let setCartItemCount = !getCartItemCount||getCartItemCount===null? 1: getCartItemCount + 1;
            this.cartService.setCartItemCount(setCartItemCount);
            let cartData = {
              itemsCount: setCartItemCount
            };
            this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
            this.validateProduct=false;
            this.addToCartShow=false;
            return {cartItem: cartItem};
          },
          error => {
            return {error: "Please select qty."};
          });
      },
      error => {
        return {error: "Please select qty."};
      });
    // this.toastr.success("done");
    this.messageService.add({severity:'success', summary:'done'});

  }
  getColor(color: any) {
    if (color) {
      return color;
    } else {
      return "";
    }
  }

  getMediaImage(product: any, color: any, productsColors: any) {
    this.mediaImage = "LoadingImage";
    let sku = product.sku;
    let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
    if (color.value) {
      this.color = color;
      let item = _.findWhere(skuProducts.items, {'color': this.color.value});
      if (item) {
        product.image = item.image;
      }
      _.each(productsColors, (color: any) => {
        if (color.value === this.color.value) {
          // @ts-ignore
          document.getElementById("colorBoxAddToCart_" + color.value + product.sku).className = "selected-color";
        } else {
          // @ts-ignore
          document.getElementById("colorBoxAddToCart_" + color.value + product.sku).className = "unselected-color";
        }

      });
      this.mediaImage = "";
    }
  }

  selectSize(product: any, size: any, productsSizes: any) {
    if (!product) {
      return;

    }
    if (!size) {
      return;
    }
    if (size.value) {
      this.size = size;

      _.each(productsSizes, (size: any) => {
        if (size.value === this.size.value) {
          // @ts-ignore
          document.getElementById("sizeBoxAddToCart_" + size.value + product.sku).className = "selected-size";
        } else {
          // @ts-ignore
          document.getElementById("sizeBoxAddToCart_" + size.value + product.sku).className = "unselected-size";
        }

      });
    }
  }

}

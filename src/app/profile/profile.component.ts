import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {CartService} from "../cart/cart.service";
import {MessageService} from "primeng/api";
import * as _ from 'underscore';
import {CartInformation} from "./interface";
import { PrimeNGConfig } from "primeng/api";
import {ProductDetailsService} from "../product-details/product-details.service";
import { ConfirmationService } from 'primeng/api';
import {UserMessageService} from "../user-message.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
})
export class ProfileComponent implements OnInit {
  cartInformation: CartInformation = {
    loadingCartItem: false,
    spinnerValue:"",
    setCartInformation:false,
    cartItems: [],
    cartSubTotal: 0,
    checkOutEnable:false
  };
  customerToken:any
  data:any
  productDialog: boolean;
  submitted: boolean;
  product:any
  products:any
  totalRs:number=0
  totalQty:number=0
  selectedProducts:any;

  constructor(
    private cookiesService:CookieService,
    private cartService:CartService,
    private messageService:MessageService,
    private primeNGConfig: PrimeNGConfig,
    private productDetailService:ProductDetailsService,
    private confirmationService: ConfirmationService,
    private userMessageService:UserMessageService
  ) {
    this.customerToken=this.cookiesService.get('customerToken')
  }
  ngOnInit(): void {
    this.primeNGConfig.ripple = true;
    this.getMyCartInformation()
  }


   getMyCartInformation() {
    let $this = this
    this.cartService.getCustomerCartDetail(this.customerToken)
      .then((cart:any) => {
        console.log("cart",cart)
          let cartData = {
            itemsCount: cart.items_count
          };
          this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
          this.cartService.setCartItemCount(cartData.itemsCount);
          if (cart.items_count === 0) {
            this.cartInformation.loadingCartItem = false;
            this.cartInformation.spinnerValue = "";
            return;
          }
          _.each(cart.items, function (item) {
            item.subTotal=item.qty*item.price;
            $this.productDetailService.getProductMediaGallery(item.sku)
              .subscribe(
                (images:any) => {
                  _.each(images.media_gallery_entries, function (media) {
                    if (media.types && media.types.length > 0) {
                      item.image = media.file;
                    }
                  });
                },
                error => {
                     this.messageService.add({severity:'error',summary:'Profile',detail:'Cart item not loaded'})
                }
              );

          });

          this.product=cart.items
        for(let r of cart.items){
          this.totalRs=this.totalRs+r.subTotal
        }

        this.totalQty=cart.items_qty
          console.log("d",this.product)
          console.log("qty",this.totalQty)
          console.log("Rs",this.totalRs)
        },
        error => {
          this.messageService.add({severity:'error',summary:'Profile',detail:'Cart item not loaded'})
        }
      );
  }

  removeItem(item:any) {
    let $this=this;
    $this.cartInformation.loadingCartItem=true;
    $this.cartInformation.spinnerValue="Removing Cart Item";
    $this.cartService.removeCartItem(item.item_id,this.customerToken)
      .subscribe(
        (deletedCartItem:any) => {
          let deleteItemIndex;
          _.each($this.product, function (cartItem, index) {
            if (cartItem.item_id === item.item_id) {
              deleteItemIndex = index;
            }
          });
          $this.product.splice(deleteItemIndex,1);
          // $this.product.items.subTotal=( $this.product.items.subTotal-(item.price*item.qty));
          let getCartItemCount = this.cartService.getCartItemCount();
          let setCartItemCount = !getCartItemCount||getCartItemCount===null? 0: getCartItemCount - 1;
          this.cartService.setCartItemCount(setCartItemCount);
          let cartData = {
            itemsCount: setCartItemCount
          };
          this.cookiesService.set('customerCartCount', JSON.stringify(cartData));

          if(cartData){
            this.sendMessage(true)
          }
          this.totalQty=0;
          this.totalRs=0
          for(let r of $this.product){
            this.totalRs=this.totalRs+r.subTotal;
            this.totalQty=this.totalQty+r.qty
          }

          // $this.toastr.success(" Successfully removed Item from cart ");
          this.messageService.add({severity:'success', summary:'Remove Item ', detail:'Item removed successfully from cart'});
        },
        error => {
          this.messageService.add({severity:'error', summary:'Remove Item ', detail:'Item not removed from cart'});

        }
      );

  }
  sendMessage(data:boolean){
    this.userMessageService.sendUserMessage(data)
  }
  orderPlace(data:any):void{

  }
}

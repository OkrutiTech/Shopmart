import {AfterViewChecked, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountInformation,ChangePassword,AddressBook,CartInformation,PaymentInformation} from './interface';
import {ConfirmationService} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {CookieService} from "ngx-cookie-service";
import * as _ from 'underscore';
import {DashboardService} from "./dashboard.service";
import {CartService} from "../cart/cart.service";
import {ProductDetailsService} from "../product-details/product-details.service";
import {HomeService} from "../home/home.service";
import {MenuItem} from 'primeng/api';
import {UserMessageService} from "../user-message.service";





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ConfirmationService,MessageService]
})

export class DashboardComponent implements OnInit {
  selectedTab: string;
  accountInformation:AccountInformation= {
    email:'',
    firstName:'',
    lastName:'',
    disabled:true,
    setAccount:false,
    updatingAccount:false,
  };
  changePassword: ChangePassword = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    disabled: false,
    updatingPassword: false,
  };
  addressBook: AddressBook = {
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postcode: "",
    telephone: "",
    disabled: false,
    setAddressBook:false,
    updatingAddressBook: false
  };
  cartInformation: CartInformation = {
    loadingCartItem: false,
    spinnerValue:"",
    setCartInformation:false,
    cartItems: [],
    cartSubTotal: 0,
    checkOutEnable:false
  };
  paymentInformation: PaymentInformation = {
    loadingPaymentInformation: false,
    spinnerValue: "",
    shippingItems: [],
    paymentMethods:[],
    shippingTotalSegments: []
  };
  categories:any;
  // @ViewChild('tabs')
  // private tabs: NgbTabset;


  constructor(private _activeRoute: ActivatedRoute, private _route: Router,private cookieService:CookieService,private dashboardService:DashboardService,private cartService:CartService,private productDetailService:ProductDetailsService,private confirmationService: ConfirmationService,private messageService: MessageService,private homeService:HomeService,private userMessageService:UserMessageService) {
    this._activeRoute.data.subscribe(d => {
      this.selectedTab = d.name;
    });
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe(
      // params => {
      //   let selectedTab = params['selectedTab'];
      //   if (selectedTab === "account-information") {
      //     this.selectedTab = 'AccountInformation';
      //   }
      //   else if(selectedTab === "change-password"){
      //     this.selectedTab = 'ChangePassword';
      //   }
      //   else if(selectedTab === "address-book-information"){
      //     this.selectedTab = 'AddressBook';
      //   }
      //   else if(selectedTab === "cart-information"){
      //     this.selectedTab = 'CartInformation';
      //   }
      //   else if(selectedTab === "orders-information"){
      //     this.selectedTab = 'OrdersInformation';
      //   }
      //   else if(selectedTab === "cart-checkout"){
      //     this.selectedTab = 'CheckOut';
      //   }
      // }
    );
  }

  // ngAfterViewChecked(): void {
  //   if (this.tabs) {
  //     this.tabs.select(this.selectedTab);
  //     this.categories= this.homeService.getData();
  //     this.getSelectedTabData();
  //   }
  // }

  // onTabChange($event) {
  //   let routes = {
  //     AccountInformation: `/user-profile/account-information`,
  //     ChangePassword: `/user-profile/change-password`,
  //     AddressBook: `/user-profile/address-book-information`,
  //     CartInformation: `/user-profile/cart-information`,
  //     OrdersInformation: `/user-profile/orders-information`,
  //     CheckOut: `/user-profile/cart-checkout`,
  //   };
  //
  //   this._route.navigateByUrl(routes[$event.nextId]);
  // }
  //
  // getSelectedTabData(){
  //   let customerDetail = JSON.parse(this.cookieService.get('customerDetail'));
  //   if(this.selectedTab==="AccountInformation" && customerDetail && !this.accountInformation.setAccount){
  //     this.accountInformation.firstName=customerDetail.firstname;
  //     this.accountInformation.lastName=customerDetail.lastname;
  //     this.accountInformation.email=customerDetail.email;
  //     this.accountInformation.setAccount=true;
  //   }
  //   if (this.selectedTab === "AddressBook" && customerDetail.addresses.length > 0 &&  !this.addressBook.setAddressBook) {
  //     let address = customerDetail.addresses[0];
  //     this.addressBook.firstName = address.firstname;
  //     this.addressBook.lastName = address.lastname;
  //     this.addressBook.telephone = address.telephone;
  //     this.addressBook.addressLine1 = address.street[0];
  //     this.addressBook.addressLine2 = address.street[1];
  //     this.addressBook.city = address.city;
  //     this.addressBook.region = address.region.region;
  //     this.addressBook.postcode = address.postcode;
  //     this.addressBook.setAddressBook=true;
  //     this.addressBook.disabled=true;
  //   }
  //   if (this.selectedTab === "CartInformation" && this.cartInformation.cartItems.length === 0 && !this.cartInformation.setCartInformation) {
  //     this.cartInformation.loadingCartItem = true;
  //     this.cartInformation.spinnerValue="Fetching Cart Information";
  //     this.cartInformation.setCartInformation = true;
  //     this.getMyCartInformation();
  //   }
  //   if(this.selectedTab === "CheckOut" && !this.cartInformation.checkOutEnable){
  //     this.loadPaymentOption();
  //   }
  // }
  //
  editAccountInformation(feild:any){
    if (feild === "accountInformation" && this.accountInformation.disabled) {
      this.accountInformation.disabled=false;
    }
    else{
      this.accountInformation.updatingAccount=true;
      if (! this.accountInformation.email && ! this.accountInformation.firstName && ! this.accountInformation.lastName) {
        this.accountInformation.updatingAccount=false;
        return;
      }
      let data = {
        "customer": {
          "email":  this.accountInformation.email,
          "firstname": this.accountInformation.firstName,
          "lastname":  this.accountInformation.lastName,
          "storeId": 1,
          "websiteId": 1
        }
      };
      this.dashboardService.PutAccountInformation(data)
        .subscribe(
          customer => {
            this.cookieService.set('customerDetail', JSON.stringify(customer));
            let customerDetail= this.cookieService.get('customerDetail');
            if (customerDetail) {
              let customer = JSON.parse(customerDetail);
              if (customer) {
                let userName = customer.firstname + " " + customer.lastname;
                this.homeService.setUserName(userName);
                this.sendMessage(true)
              }
            }
            this.messageService.add({severity:'success', summary:'Account', detail:'Updated Account Successfully'});
            this.accountInformation.updatingAccount=false;
            this.accountInformation.disabled=true;
          },
          error => {
            this.messageService.add({severity:'error', summary:'Account', detail:'Please fill all field'});
          }
        );
    }

  }
  //
    updatePassword() {
    this.changePassword.updatingPassword = true;
    if (!this.changePassword.currentPassword && !this.changePassword.newPassword && !this.changePassword.confirmNewPassword) {
      this.changePassword.updatingPassword = false;
      return;
    }
    let customerPassword = {
      "currentPassword": this.changePassword.currentPassword,
      "newPassword": this.changePassword.confirmNewPassword
    };
    this.dashboardService.changePassword(customerPassword)
      .subscribe(
        (password:any) => {
          this.messageService.add({severity:'success', summary:'Password Updated', detail:'Updated Password Successfully'});
          this.changePassword.updatingPassword = false;

        },
        error => {
          this.messageService.add({severity:'success', summary:'Password Updated', detail:'Updated Password failed'});
        }
      );

  }

  updateAddress() {
    if (this.addressBook.setAddressBook && this.addressBook.disabled) {
      this.addressBook.disabled = false;
    } else {
      this.addressBook.updatingAddressBook = true;
      if (!this.addressBook.firstName || !this.addressBook.lastName || !this.addressBook.telephone || !(this.addressBook.addressLine1 || this.addressBook.addressLine2) || !this.addressBook.city || !this.addressBook.region || !this.addressBook.postcode) {
        this.addressBook.updatingAddressBook = false;
        this.accountInformation.disabled = false;
        return;
      } else {
        let customerDetail = JSON.parse(this.cookieService.get('customerDetail'));
        let customerData = {
          "customer": {
            "email": customerDetail.email,
            "firstname": customerDetail.firstname,
            "lastname": customerDetail.lastname,
            "websiteId": 1,
            "addresses": [
              {
                "firstname": this.addressBook.firstName,
                "lastname": this.addressBook.lastName,
                "street": [
                  this.addressBook.addressLine1,
                  this.addressBook.addressLine2
                ],
                "city": this.addressBook.city,
                "region": {
                  "region": this.addressBook.region
                },
                "country_id": "IN",
                "postcode": this.addressBook.postcode,
                "telephone": this.addressBook.telephone
              },
              {
                "firstname": this.addressBook.firstName,
                "lastname": this.addressBook.lastName,
                "street": [
                  this.addressBook.addressLine1,
                  this.addressBook.addressLine2
                ],
                "city": this.addressBook.city,
                "region": {
                  "region": this.addressBook.region
                },
                "country_id": "IN",
                "postcode": this.addressBook.postcode,
                "telephone": this.addressBook.telephone
              }
            ]
          }
        };
        this.dashboardService.PutAccountInformation(customerData)
          .subscribe(
            customer => {
              this.cookieService.set('customerDetail', JSON.stringify(customer));
              let customerDetail = this.cookieService.get('customerDetail');
              if (customerDetail) {
                let customer = JSON.parse(customerDetail);
                if (customer) {
                  let userName = customer.firstname + " " + customer.lastname;
                  this.sendMessage(true)
                  this.homeService.setUserName(userName);

                }
              }
              this.shipmentAddress()
              this.messageService.add({
                severity: 'success',
                summary: 'Address Book',
                detail: 'Updated Address Book Successfully'
              });

              this.addressBook.updatingAddressBook = false;
              this.addressBook.disabled = true;
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Address Book',
                detail: 'Updated Address Book failed'
              });
            }
          );
      }
    }
  }

  getMyCartInformation() {
  //   let $this = this;
  //   $this.cartService.getCustomerCartDetail()
  //     .subscribe(
  //       (cart:any) => {
  //         let cartData = {
  //           itemsCount: cart.items_count
  //         };
  //         $this.cookieService.set('customerCartCount', JSON.stringify(cartData));
  //         $this.cartService.setCartItemCount(cartData.itemsCount);
  //         if (cart.items_count === 0) {
  //           $this.cartInformation.loadingCartItem = false;
  //           $this.cartInformation.spinnerValue = "";
  //           return;
  //         }
  //         _.each(cart.items, function (item) {
  //           item.subTotal=item.qty*item.price;
  //           $this.cartInformation.cartSubTotal=$this.cartInformation.cartSubTotal+item.subTotal;
  //           $this.productDetailService.getProductMediaGallery(item.sku)
  //             .subscribe(
  //               (images:any) => {
  //                 _.each(images.media_gallery_entries, function (media) {
  //                   if (media.types && media.types.length > 0) {
  //                     item.image = media.file;
  //                   }
  //                 });
  //                 $this.cartInformation.cartItems.push(item);
  //                 if (cart.items.length === $this.cartInformation.cartItems.length) {
  //                   $this.cartInformation.loadingCartItem = false;
  //                   $this.cartInformation.spinnerValue="";
  //                 }
  //               },
  //               error => {
  //
  //               }
  //             );
  //
  //         });
  //
  //       },
  //       error => {
  //         // this.toastr.error(error.message);
  //       }
  //     );
  }
  //
  updateQuantity(item) {
    //   let token=this.cookieService.get('customerToken')
    //   let $this=this;
    //   $this.cartInformation.loadingCartItem=true;
    //   $this.cartInformation.spinnerValue="Updating Item Qty";
    //   let data = {
    //     cart_item: _.pick(item, 'item_id', 'sku', 'qty', 'name', 'price', 'product_type', 'quote_id')
    //   };
    //   $this.cartService.updateCartItemQuantity(data,token)
    //     .subscribe(
    //       (updatedCartItem:any) => {
    //         _.each($this.cartInformation.cartItems,function (cartItem) {
    //           if (cartItem.item_id === item.item_id) {
    //             item.subTotal = updatedCartItem.qty * updatedCartItem.price;
    //           }
    //         });
    //         $this.cartInformation.cartSubTotal=$this.cartInformation.cartSubTotal+updatedCartItem.price;
    //         $this.cartInformation.loadingCartItem=false;
    //         $this.cartInformation.spinnerValue="";
    //         this.messageService.add({severity:'success', summary:'Add Item ', detail:'Item quantity updated successfully'});
    //
    //         // $this.toastr.success("Item quantity updated successfully");
    //       },
    //       error => {
    //         // $this.toastr.error(error.message);
    //       }
    //     );
    //
    }
    //
    removeItem(item)
    {
      //   let token=this.cookieService.get('customerToken')
      //   let $this=this;
      //   $this.cartInformation.loadingCartItem=true;
      //   $this.cartInformation.spinnerValue="Removing Cart Item";
      //   $this.cartService.removeCartItem(item.item_id,token)
      //     .subscribe(
      //       deletedCartItem => {
      //         let deleteItemIndex;
      //         _.each($this.cartInformation.cartItems, function (cartItem, index) {
      //           if (cartItem.item_id === item.item_id) {
      //             deleteItemIndex = index;
      //           }
      //         });
      //         $this.cartInformation.cartItems.splice(deleteItemIndex,1);
      //         $this.cartInformation.cartSubTotal=( $this.cartInformation.cartSubTotal-(item.price*item.qty));
      //         let getCartItemCount = this.cartService.getCartItemCount();
      //         let setCartItemCount = !getCartItemCount||getCartItemCount===null? 0: getCartItemCount - 1;
      //         this.cartService.setCartItemCount(setCartItemCount);
      //         let cartData = {
      //           itemsCount: setCartItemCount
      //         };
      //         this.cookieService.set('customerCartCount', JSON.stringify(cartData));
      //         $this.cartInformation.loadingCartItem=false;
      //         $this.cartInformation.spinnerValue="";
      //         this.messageService.add({severity:'success', summary:'Remove Item ', detail:'Item removed successfully from cart'});
      //
      //         // $this.toastr.success(" Successfully removed Item from cart ");
      //       },
      //       error => {
      //         // $this.toastr.error(error.message);
      //       }
      //     );
      //
    }

  shipmentAddress()
  {
    let customer = JSON.parse(this.cookieService.get('customerDetail'));
    // if (!customer || customer.addresses.length === 0) {
    //   this.updateBillingAddressPopUp();
    //   return;
    // }
    // this.cartInformation.checkOutEnable=true;
    // this._route.navigateByUrl("/user-profile/cart-checkout");
    // this.paymentInformation.loadingPaymentInformation=true;
    this.paymentInformation.spinnerValue="Loading Shipping & Payment Methods Information";
    let address = {
      "customer_id": customer.id,
      "region": customer.addresses[0].region.region,
      "region_id": customer.addresses[0].region_id,
      "country_id": customer.addresses[0].country_id,
      "street": customer.addresses[0].street,
      "telephone": customer.addresses[0].telephone,
      "postcode": customer.addresses[0].postcode,
      "city": customer.addresses[0].city,
      "firstname": customer.firstname,
      "lastname": customer.lastname,
      "prefix": "address_",
      "region_code": customer.addresses[0].region.region_code
    };
    let  shippingData = {
      "addressInformation": {
        shippingAddress: {
          "sameAsBilling": 1
        },
        "billingAddress": {},
        "shipping_method_code": "flatrate",
        "shipping_carrier_code": "flatrate"
      }

    }

    shippingData.addressInformation.billingAddress = _.extend(shippingData.addressInformation.billingAddress, address);
    shippingData.addressInformation.shippingAddress = _.extend(shippingData.addressInformation.shippingAddress, address);
    this.cartService.shippingInformation(shippingData)
      .subscribe(
        (checkOut:any) => {
          _.each(checkOut.totals.items, function (item) {
            item.base_price_incl_tax = (item.base_price_incl_tax).toFixed(2);
            item.base_row_total_incl_tax = (item.base_row_total_incl_tax).toFixed(2);
          });
          _.each(checkOut.totals.total_segments, function (totalSegment) {
            totalSegment.value = (totalSegment.value).toFixed(2);
          });
          // this.messageService.add({severity:'success', summary:'Shipping information & Payment methods ', detail:'Shipping information & Payment methods loaded successfully'});
          // this.paymentInformation.paymentMethods=checkOut.payment_methods;
          // this.paymentInformation.shippingItems=checkOut.totals.items;
          // this.paymentInformation.shippingTotalSegments=checkOut.totals.total_segments;
          // this.paymentInformation.loadingPaymentInformation=false;
          // this.cartInformation.spinnerValue="";
          // this.cartInformation.checkOutEnable=true;
        },
        error => {
          // this.toastr.error(error.message);
        }
      );

  }

    loadPaymentOption()
    {
        let customer = JSON.parse(this.cookieService.get('customerDetail'));
        if (!customer || customer.addresses.length === 0) {
          this.updateBillingAddressPopUp();
          return;
        }
        this.cartInformation.checkOutEnable=true;
        // this._route.navigateByUrl("/user-profile/cart-checkout");
        this.paymentInformation.loadingPaymentInformation=true;
        this.paymentInformation.spinnerValue="Loading Shipping & Payment Methods Information";
        let address = {
          "customer_id": customer.id,
          "region": customer.addresses[0].region.region,
          "region_id": customer.addresses[0].region_id,
          "country_id": customer.addresses[0].country_id,
          "street": customer.addresses[0].street,
          "telephone": customer.addresses[0].telephone,
          "postcode": customer.addresses[0].postcode,
          "city": customer.addresses[0].city,
          "firstname": customer.firstname,
          "lastname": customer.lastname,
          "prefix": "address_",
          "region_code": customer.addresses[0].region.region_code
        };
        let  shippingData = {
          "addressInformation": {
            shippingAddress: {
              "sameAsBilling": 1
            },
            "billingAddress": {},
            "shipping_method_code": "flatrate",
            "shipping_carrier_code": "flatrate"
          }

        }

        shippingData.addressInformation.billingAddress = _.extend(shippingData.addressInformation.billingAddress, address);
        shippingData.addressInformation.shippingAddress = _.extend(shippingData.addressInformation.shippingAddress, address);
        this.cartService.shippingInformation(shippingData)
          .subscribe(
            (checkOut:any) => {
              _.each(checkOut.totals.items, function (item) {
                item.base_price_incl_tax = (item.base_price_incl_tax).toFixed(2);
                item.base_row_total_incl_tax = (item.base_row_total_incl_tax).toFixed(2);
              });
              _.each(checkOut.totals.total_segments, function (totalSegment) {
                totalSegment.value = (totalSegment.value).toFixed(2);
              });
              this.messageService.add({severity:'success', summary:'Shipping information & Payment methods ', detail:'Shipping information & Payment methods loaded successfully'});
              this.paymentInformation.paymentMethods=checkOut.payment_methods;
              this.paymentInformation.shippingItems=checkOut.totals.items;
              this.paymentInformation.shippingTotalSegments=checkOut.totals.total_segments;
              this.paymentInformation.loadingPaymentInformation=false;
              this.cartInformation.spinnerValue="";
              this.cartInformation.checkOutEnable=true;
            },
            error => {
              // this.toastr.error(error.message);
            }
          );

    }
    createPaymentData(paymentMethod)
    {
      //   this.paymentInformation.loadingPaymentInformation=true;
      //   this.paymentInformation.spinnerValue="Placing Order";
      //   let totalAmountSegment=_.findWhere(this.paymentInformation.shippingTotalSegments, {code: "grand_total"});
      //   let data = {
      //     "paymentMethod": {
      //       "method": paymentMethod.code
      //     },
      //     ORDER_ID:"",
      //     CUST_ID:"",
      //     TXN_AMOUNT:""
      //
      //   };
      //   let customer = JSON.parse(this.cookieService.get('customerDetail'));
      //   if(!customer){
      //     return;
      //   }
      //   let customerId = customer.id;
      //   let customerEmail = customer.email;
      //   let totalPayableAmount = totalAmountSegment.value;
      //   this.cartService.orderPlaced(data)
      //     .subscribe(
      //       (orderId:any) => {
      //         if (data.paymentMethod.method === "paytm") {
      //           let paytmData = {
      //             "ORDER_ID": orderId,
      //             "CUST_ID": customerId,
      //             "TXN_AMOUNT": totalPayableAmount,
      //             "CHANNEL_ID": "WEB",
      //             "INDUSTRY_TYPE_ID": "Retail",
      //             "WEBSITE": "WEB_STAGING"
      //           };
      //           this.cartService.paymentMethod(paytmData)
      //             .subscribe(
      //               (responseHtml:any) => {
      //                 this.cartService.setPaymentHtml(responseHtml);
      //                 this.paymentInformation.loadingPaymentInformation=false;
      //                 this.paymentInformation.spinnerValue="";
      //                 this._route.navigateByUrl(`payment-option/${data.paymentMethod.method}/method`);
      //               },
      //               error => {
      //                 // this.toastr.error(error.message);
      //               }
      //             );
      //         }else{
      //           data.ORDER_ID=orderId;
      //           data.CUST_ID=customerId;
      //           data.TXN_AMOUNT= totalPayableAmount;
      //           this.cookieService.set('transactionOrderDetails',JSON.stringify(data));
      //           this._route.navigateByUrl('/payment/status/success');
      //         }
      //       },
      //       error => {
      //         // this.toastr.error(error.message);
      //       }
      //     );
      //
    }

    updateBillingAddressPopUp()
    {
        this.confirmationService.confirm({
          message: 'There is no Billing address set in your account?',
          header: 'Billing address Not Set',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this._route.navigateByUrl('/user-profile/address-book-information')
          },
          reject: () => {
            this.messageService.add({severity:'error', summary:'Address Not Updated ', detail:'WithOut billing address You are not to proceed checkOut page'});
          }
        });
    }

    sendMessage(data:boolean){
    this.userMessageService.sendUserMessage(data)
    }
}

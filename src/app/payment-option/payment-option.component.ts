import { Component, OnInit } from '@angular/core';
import {CartService} from "../cart/cart.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PaymentOptionService} from "./paymentOption.service";
import {PaymentInformation,CartInformation} from "./interface";
import * as _ from 'underscore';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss'],
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
  `]
})
export class PaymentOptionComponent implements OnInit {
  addressData:any
  billingData:any
  showPayment:boolean=false
  displayModal: boolean;
  displayBasic: boolean;
  position: string;
  signUpFrom: FormGroup;
  submitted = false;
  months: [1,2,3,4,5,6,7,8,9,10,11,12]
  selectedMonth:string=''
  years:any;
  selectedYear:any;
  cartData:any=[]

  constructor(
    private cartService:CartService,
    private activeRouter:ActivatedRoute,
    private router:Router,
    private cookieService:CookieService,
    private paymentOptionService:PaymentOptionService,
    private primengConfig: PrimeNGConfig,
    private formBuilder: FormBuilder,
    private messageService:MessageService,
    private datepipe: DatePipe
  ) { }
  paymentInformation: PaymentInformation = {
    loadingPaymentInformation: false,
    spinnerValue: "",
    shippingItems: [],
    paymentMethods:[],
    shippingTotalSegments: []
  };
  cartInformation: CartInformation = {
    loadingCartItem: false,
    spinnerValue:"",
    setCartInformation:false,
    cartItems: [],
    cartSubTotal: 0,
    checkOutEnable:false
  };
  paymentCode:string
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    console.log(this.cookieService.get("customerToken"))
    this.cartService.getCustomerCartDetail().subscribe((data:any)=>{
        this.addressData=data.customer.addresses[0]
      this.billingData=data.billing_address
      // for(let d of this.billingData.street){
      //   console.log("d",d,this.billingData.firstname)
      // }
      let cartDetails=this.cookieService.get('CartDetail')
      if(cartDetails){
        this.cartData=JSON.parse(cartDetails)
        console.log("carts",this.cartData)
      }


    })
    this.signUpFrom = this.formBuilder.group(
      {
        cardName:[],
        cardNumber: [''],
        name: [''],
        date:['']
      },
    );
  }


  showModalDialog() {
    this.displayModal = true;
  }

  showBasicDialog() {
    this.displayBasic = true;
  }
  onSubmit(): void {
    this.submitted = true;
    // let signUp={""}
    if (this.signUpFrom.invalid) {
      return;
    }
    console.log(JSON.stringify(this.signUpFrom.value, null, 2));
  }
  get f(): { [key: string]: AbstractControl } {
    return this.signUpFrom.controls;
  }

  addYourCard() {

    this.displayBasic=false
    this.submitted = true;
    if (this.signUpFrom.invalid) {
      return;
    }
    const {cardName,cardNumber,name,date}=this.signUpFrom.value
    if(cardName && cardNumber && name && date){
      let dateConvert=this.datepipe.transform(date, 'MM / YYYY')
      let data:any={cardName,cardNumber,name,dateConvert}
      let customerDetails:any=this.cookieService.get('customerDetail');
     let oldData:any=this.cookieService.get('CartDetail')?JSON.parse(this.cookieService.get('CartDetail')):'';
      if(customerDetails){
        const newData=[...oldData,data]
        console.log("newData",newData)
        this.cookieService.set('CartDetail', JSON.stringify(newData));
      }
      else{
        this.messageService.add({severity:'error', summary:'Customer', detail:'Your are not login !'})
      }
      // console.log("data",data)
    }
    else{
      this.messageService.add({severity:'error', summary:'Card', detail:'fill card details !'})
      this.displayBasic=true
    }



    // if (this.signUpFrom.controls.cardNumber && !this.signUpFrom.controls.emailExists) {
    //   this.createCustomer="Creating customer";
    //   let customerData = {
    //     "customer": {
    //       "email": this.signUpFrom.controls.email.value,
    //       "firstname": this.signUpFrom.controls.firstname.value,
    //       "lastname": this.signUpFrom.controls.lastname.value,
    //       "storeId": 1,
    //       "websiteId": 1
    //     },
    //     "password": this.signUpFrom.controls.password.value,
    //   };
    //
    //   this.newUserService.signUp(customerData)
    //     .subscribe(
    //       customer => {
    //
    //         this.cookieService.set('customerDetail',JSON.stringify(customer));
    //         let user = {
    //           username: customerData.customer.email,
    //           password: customerData.password
    //         };
    //         this.newUserService.getCustomerToken(user)
    //           .subscribe(
    //             token => {
    //               this.cookieService.set('customerToken', "Bearer " + token);
    //               let tokenData=this.cookieService.get('customerToken');
    //               tokenData="Bearer " + token;
    //               this.createCustomer="Creating customer cart";
    //               this.messageService.add({severity:'success', summary:'Customer', detail:'Create customer Successfully'});
    //
    //               // this.toastr.success("Create customer Successfully");
    //               this.newUserService.customerCartCreate(tokenData)
    //                 .subscribe(
    //                   cart => {
    //                     //console.log(cart);
    //                     this.messageService.add({severity:'success', summary:'Customer', detail:'Customer cart created Successfully"'});
    //
    //                     // this.toastr.success("customer cart created Successfully");
    //
    //                     this._router.navigate(['']);
    //                   },
    //                   error => {
    //                     //   this.toastr.error(error.message);
    //                     // this.toastr.error(error.message);
    //                     this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
    //                   }
    //                 );
    //             },
    //             error => {
    //               //   this.toastr.error(error.message);
    //               this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
    //             }
    //           );
    //       },
    //       error => {
    //         //   this.toastr.error(error.message);
    //         this.messageService.add({severity:'error', summary:'Customer', detail:'Customer cart not Created"'});
    //       }
    //     );
    //
    // }
  }

  paymentMethod(){
    this.showPayment=true
    this.paymentOptionService.getPaymentMethod().subscribe((data:any)=>{
      console.log("method",data)
      this.paymentCode=data[0].code
      if(this.paymentCode){
        // this.createPaymentData(this.paymentCode)
      }
    })
  }

  loadPaymentOption() {
    this.createPaymentData(this.paymentCode)
    // let customer = JSON.parse(this.cookieService.get('customerDetail'));
    // if (!customer || customer.addresses.length === 0) {
    //   // this.updateBillingAddressPopUp();
    //   return;
    // }
    // this.cartInformation.checkOutEnable=true;
    // // this._route.navigateByUrl("/user-profile/cart-checkout");
    // this.paymentInformation.loadingPaymentInformation=true;
    // this.paymentInformation.spinnerValue="Loading Shipping & Payment Methods Information";
    // let address = {
    //   "customer_id": customer.id,
    //   "region": customer.addresses[0].region.region,
    //   "region_id": customer.addresses[0].region_id,
    //   "country_id": customer.addresses[0].country_id,
    //   "street": customer.addresses[0].street,
    //   "telephone": customer.addresses[0].telephone,
    //   "postcode": customer.addresses[0].postcode,
    //   "city": customer.addresses[0].city,
    //   "firstname": customer.firstname,
    //   "lastname": customer.lastname,
    //   "prefix": "address_",
    //   "region_code": customer.addresses[0].region.region_code
    // };
    // let  shippingData = {
    //   "addressInformation": {
    //     shippingAddress: {
    //       "sameAsBilling": 1
    //     },
    //     "billingAddress": {},
    //     "shipping_method_code": "flatrate",
    //     "shipping_carrier_code": "flatrate"
    //   }
    //
    // };
    // shippingData.addressInformation.billingAddress = _.extend(shippingData.addressInformation.billingAddress, address);
    // shippingData.addressInformation.shippingAddress = _.extend(shippingData.addressInformation.shippingAddress, address);
    // this._cartService.shippingInformation(shippingData)
    //   .subscribe(
    //     checkOut => {
    //       _.each(checkOut.totals.items, function (item) {
    //         item.base_price_incl_tax = (item.base_price_incl_tax).toFixed(2);
    //         item.base_row_total_incl_tax = (item.base_row_total_incl_tax).toFixed(2);
    //       });
    //
    //       _.each(checkOut.totals.total_segments, function (totalSegment) {
    //         totalSegment.value = (totalSegment.value).toFixed(2);
    //       });
    //       this.messageService.add({severity:'success', summary:'Shipping information & Payment methods ', detail:'Shipping information & Payment methods loaded successfully'});
    //       // this.toastr.success("Shipping information & Payment methods loaded successfully");
    //       this.paymentInformation.paymentMethods=checkOut.payment_methods;
    //       this.paymentInformation.shippingItems=checkOut.totals.items;
    //       this.paymentInformation.shippingTotalSegments=checkOut.totals.total_segments;
    //       this.paymentInformation.loadingPaymentInformation=false;
    //       this.cartInformation.spinnerValue="";
    //       this.cartInformation.checkOutEnable=true;
    //     },
    //     error => {
    //       this.toastr.error(error.message);
    //     }
    //   );

  }

  createPaymentData(paymentMethod){
    this.paymentInformation.loadingPaymentInformation=true;
    this.paymentInformation.spinnerValue="Placing Order";
    let totalAmountSegment=_.findWhere(this.paymentInformation.shippingTotalSegments, {code: "grand_total"});
    console.log("code",paymentMethod)
    let data = {
      "paymentMethod": {
        "method": paymentMethod
      },
      ORDER_ID:"",
      CUST_ID:"",
      TXN_AMOUNT:""

    };
    let customer = JSON.parse(this.cookieService.get('customerDetail'));
    if(!customer){
      return;
    }
    let customerId = customer.id;
    let customerEmail = customer.email;
    let totalPayableAmount = totalAmountSegment.value;
    console.log('d',data)
    this.cartService.orderPlaced(data)
      .subscribe(
        (orderId:any) => {
          console.log("id",orderId)
          if (data.paymentMethod.method === "paytm") {
            let paytmData = {
              "ORDER_ID": orderId,
              "CUST_ID": customerId,
              "TXN_AMOUNT": totalPayableAmount,
              "CHANNEL_ID": "WEB",
              "INDUSTRY_TYPE_ID": "Retail",
              "WEBSITE": "WEB_STAGING"
            };
            this.cartService.paymentMethod(paytmData)
              .subscribe(
                (responseHtml:any) => {
                  console.log("Pay",responseHtml)
                  this.cartService.setPaymentHtml(responseHtml);
                  this.paymentInformation.loadingPaymentInformation=false;
                  this.paymentInformation.spinnerValue="";
                  // this._route.navigateByUrl(`payment-option/${data.paymentMethod.method}/method`);
                },
                error => {
                  // this.toastr.error(error.message);
                }
              );
          }else{
            data.ORDER_ID=orderId;
            data.CUST_ID=customerId;
            data.TXN_AMOUNT= totalPayableAmount;
            this.cookieService.set('transactionOrderDetails',JSON.stringify(data));
            // this._route.navigateByUrl('/payment/status/success');
          }
        },
        error => {
          // this.toastr.error(error.message);
        }
      );

  }
}

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
import {SelectItem} from 'primeng/api';
import {SelectItemGroup} from 'primeng/api';
interface Bank {
  name: string,
  code: string
}
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
  banks: Bank[];
  selectedBank: Bank;
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
  recomandedPayMethod:boolean=false
  checked1: boolean = false;
  value1: string = 'off';
  stateOptions:any
  selectUpiPaymentMethod:string;
  payOnDeliery:string;
  netBanking:string;
  selectCard:string;
  responseData:any;

  constructor(
    private cartService:CartService,
    private activeRouter:ActivatedRoute,
    private router:Router,
    private cookieService:CookieService,
    private paymentOptionService:PaymentOptionService,
    private primengConfig: PrimeNGConfig,
    private formBuilder: FormBuilder,
    private messageService:MessageService,
    private datepipe: DatePipe,
  ) {
    this.banks = [
      {name: 'Allahabad Bank', code: 'AB'},
      {name: 'State Bank of India', code: 'SBI'},
      {name: 'Punjab National Bank', code: 'PNB'},
      {name: 'Indian Bank', code: 'IB'},
      {name: 'Union Bank of India', code: 'UNB'}
    ];
    this.stateOptions = !this.checked1
  }

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
    this.cartService.getCustomerCartDetail().subscribe((data:any)=>{
        this.addressData=data.customer.addresses[0]
      this.billingData=data.billing_address
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
        date:[''],
        payTmUpi:['']
      },
    );


    this.activeRouter.params.subscribe(routeParams => {
      if(routeParams.methodType==='paytm'){
        this.responseData = this.cartService.getPaymentHtml();
        // setTimeout(function() {
        //   var script = document.createElement('script');
        //   script.type = "text/javascript";
        //   script.innerHTML = "document.f1.submit();";
        //   document.body.appendChild(script);
        // }, 5);
        console.log('getPaymentHtml',this.responseData)
      }
    });
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

  recomandedPaymentDialog(){
    this.recomandedPayMethod = true;
  }
  cardButton(data:any){
    this.selectCard=data
    this.netBanking=''
      this.payOnDeliery=''
      this.selectUpiPaymentMethod=''
    console.log(this.selectCard)
  }
  netBankingButton(data:any){
    this.selectCard=''
    this.netBanking=data
      this.payOnDeliery=''
      this.selectUpiPaymentMethod=''
    console.log(this.netBanking)
  }
  payOnDeliveryButton(data:any){
    this.selectCard=''
    this.netBanking=''
      this.payOnDeliery=data
      this.selectUpiPaymentMethod=''
    console.log(this.payOnDeliery)
  }
  upiPaymentButton(data:any){
    this.selectCard=''
    this.netBanking=''
      this.payOnDeliery=''
      this.selectUpiPaymentMethod=data
    console.log(this.selectUpiPaymentMethod)
  }

  createPaymentData(paymentMethod){
    this.paymentInformation.loadingPaymentInformation=true;
    this.paymentInformation.spinnerValue="Placing Order";
    // let totalAmountSegment=_.findWhere(this.paymentInformation.shippingTotalSegments, {code: "grand_total"});
    let totalAmountSegment='2501';
    console.log("code",paymentMethod)
    let data = {
      "paymentMethod": {
        "method": this.paymentCode
        // "method": paymentMethod
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
    // let totalPayableAmount = totalAmountSegment.value;
    let totalPayableAmount = totalAmountSegment;
    console.log('d',data)
    this.cartService.orderPlaced(data)
      .subscribe(
        (orderId:any) => {
          console.log("id",orderId)
          // if (data.paymentMethod.method === "paytm") {
          if (paymentMethod === "paytm") {
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
                  // let cartData = {
                  //   itemsCount: this.cartService.itemsCount
                  //   // itemsCount: cart,
                  //
                  // };
                  // this.cookiesService.set('customerCartCount', JSON.stringify(cartData));
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
            // this.router.navigateByUrl('/payment/status/success');
          }
        },
        error => {
          // this.toastr.error(error.message);
        }
      );
  }
  payTm(){
    const{payTmUpi}=this.signUpFrom.value
    let splitted=payTmUpi.split("@",2)
    this.createPaymentData(splitted[1])
  }
}

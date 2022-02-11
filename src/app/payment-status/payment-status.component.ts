import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {CartService} from "../cart/cart.service";
import {MessageService} from "primeng/api";
import {NewUserService} from "../new-user/newuser.service";

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
  providers:[MessageService]
})
export class PaymentStatusComponent implements OnInit {
  transaction: any;
  paymentMethod: any;
  CUST_ID:any;
  ORDER_ID: any;
  TXN_AMOUNT: any;
  TXN_ID: any;
  BANKTXN_ID: any;
  STATUS: any;
  GATEWAYNAME: any;
  TXNDATE: any;
  scooterLeft = -200;
  timer:any;

  constructor(
    private cookieService: CookieService,
    private cartService: CartService,
    private messageService: MessageService,
    private newUserService:NewUserService
  ) {
  }

  ngOnInit() {
    if (this.cookieService.get('transactionDetails')) {
      let transactionDetails = JSON.parse(this.cookieService.get('transactionDetails'));
      if (transactionDetails) {
        transactionDetails = transactionDetails.data;
        if (transactionDetails.PAYMENTMODE === 'PPI') {
          this.transaction = transactionDetails;
          this.paymentMethod = "paytm";
          this.ORDER_ID = transactionDetails.ORDERID;
          this.TXN_AMOUNT = transactionDetails.TXNAMOUNT;
          this.TXN_ID = transactionDetails.TXNID;
          this.BANKTXN_ID = transactionDetails.BANKTXNID;
          this.STATUS = transactionDetails.STATUS;
          this.GATEWAYNAME = transactionDetails.GATEWAYNAME;
          this.TXNDATE = transactionDetails.TXNDATE;
        }
      }
    }
    else {
      let transactionOrderDetails = JSON.parse(this.cookieService.get('transactionOrderDetails'));
      if(transactionOrderDetails){
        this.paymentMethod = transactionOrderDetails.paymentMethod.method;
        this.CUST_ID = transactionOrderDetails.CUST_ID;
        this.ORDER_ID = transactionOrderDetails.ORDER_ID;
        this.TXN_AMOUNT = transactionOrderDetails.TXN_AMOUNT;
      }
    }
    this.messageService.add({severity:'success', summary:'Order Placed', detail:'Order placed Successfully'});

    let tokenData = this.cookieService.get("customerToken");
    this.newUserService.customerCartCreate(tokenData)
      .subscribe(
        (cart:any) => {
          console.log(cart);
          let setCartItemCount = 0;
          this.cartService.setCartItemCount(setCartItemCount);
          let cartData = {
            itemsCount: setCartItemCount
          };
          this.cookieService.set('customerCartCount', JSON.stringify(cartData));
          this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart created Successfully'});

          // this.toastr.success("customer cart created Successfully");
        },
        error => {
          // this.toastr.error(error.message);
        }
      );

    //Run Scooter
    this.runScooter();
  }

  runScooter() {
    let scooter = document.getElementById("scooter");
    if(!scooter){
      return;
    }
    if (this.scooterLeft >= 500) {
      this.scooterLeft = -200;
    }
    else {
      this.scooterLeft += 7;
    }
    this.timer = setTimeout(() => {
      scooter.style.left = this.scooterLeft + "px";
      this.runScooter();
    }, 100)
  }

  ngOnDestroy(){
    clearTimeout(this.timer);
  }

}

import { Component, OnInit } from '@angular/core';
import {CartService} from "../cart/cart.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss']
})
export class PaymentOptionComponent implements OnInit {

  constructor(
    private cartService:CartService,
    private activeRouter:ActivatedRoute,
    private router:Router,
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(routeParams => {
      if(routeParams.methodType==='paytm'){
         this.cartService.getPaymentHtml();
        // setTimeout(function() {
        //   var script = document.createElement('script');
        //   script.type = "text/javascript";
        //   script.innerHTML = "document.f1.submit();";
        //   document.body.appendChild(script);
        // }, 5);
      }
    });
  }

}

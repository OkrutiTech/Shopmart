import { Component, OnInit,ViewEncapsulation,OnDestroy} from '@angular/core';
import {CartService} from "../cart/cart.service";
import {MessageService} from 'primeng/api';
import {MenuItem} from 'primeng/api';
import {Subscription} from "rxjs";
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [MessageService],
  styles: [`
        .ui-steps .ui-steps-item {
            width: 25%;
        }

        .ui-steps.steps-custom {
            margin-bottom: 30px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link {
            padding: 0 1em;
            overflow: visible;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-number {
            background-color: #0081c2;
            color: #FFFFFF;
            display: inline-block;
            width: 36px;
            border-radius: 50%;
            margin-top: -14px;
            margin-bottom: 10px;
        }

        .ui-steps.steps-custom .ui-steps-item .ui-steps-title {
            color: #555555;
        }
    `],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit,OnDestroy {
  items: MenuItem[];
  activeIndex: number = 1;
  subscription:Subscription
  constructor(
    private cartService:CartService,
    private messageService:MessageService,
  ) { }

  ngOnInit() {
    console.log("cartData",this.cartService)
    // this.items = [{
    //   label: 'Personal',
    //   routerLink: 'personal'
    // },
    //   // {
    //   //   label: 'Seat',
    //   //   routerLink: 'seat'
    //   // },
    //   {
    //     label: 'Payment',
    //     routerLink: 'payment'
    //   },
    //   // {
    //   //   label: 'Confirmation',
    //   //   routerLink: 'confirmation'
    //   // }
    // ];
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

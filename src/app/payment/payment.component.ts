import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentInformation: any;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  nextPage() {
    // if (this.paymentInformation.cardholderName && this.paymentInformation.cardholderNumber && this.paymentInformation.date && this.paymentInformation.cvv) {
    //   this.ticketService.ticketInformation.paymentInformation = this.paymentInformation;
      this.router.navigate(['steps/confirmation']);
    // }
  }

  prevPage() {
    this.router.navigate(['steps/seat']);
  }

}


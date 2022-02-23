export class PaymentInformation {
  loadingPaymentInformation: boolean;
  spinnerValue:string;
  paymentMethods:any;
  shippingItems:any;
  shippingTotalSegments: any;
}
export class CartInformation {
  loadingCartItem: boolean;
  spinnerValue:string;
  setCartInformation:boolean;
  cartItems: any;
  cartSubTotal: number;
  checkOutEnable:boolean;
}

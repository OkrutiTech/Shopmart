import {Injectable} from "@angular/core";
import {HttpClient , HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CartService{
  constructor(private http:HttpClient,private cookieService:CookieService) {
  }
  private cartItemCount;
  private paymentData;
  getCustomerCartDetail() {
    let tokenData=this.cookieService.get('customerToken')
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    let url='/cart-backend/rest/V1/carts/mine';
    return this.http.get(url,{headers:headers})
      // .toPromise()
      // .then(res => {return res})

  }
  // setCartItemCount(count) {
  //   return this.cartItemCount = count;
  // }
  // getCartItemCount() {
  //   return this.cartItemCount ;
  // }

  quoteId(tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    // let tokenData=this._cookie.get("customerToken");
    let url='/cart-backend/rest/V1/carts/mine'
    // options.headers.set("authorization", tokenData);
    return this.http.post(url,null,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }

  addCartItem(cartItem,tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    let url='/cart-backend/rest/V1/carts/mine/items'
    return this.http.post(url,cartItem,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }

  validateCart(product, selectedColor, selectedSize, qty) {
    if ((product.sizes.length > 0 && !selectedSize) && (product.colors.length > 0 && !selectedColor) && (!qty || qty === 0)) {
      return {error: "Please select color,size and qty."};
    }
    if ((product.sizes.length > 0 && !selectedSize) && (product.colors.length > 0 && !selectedColor)) {
      return {error: "Please select color and size."};
    }
    if (product.colors.length > 0 && !selectedColor) {
      return {error: "Please select color."};
    }
    if (product.sizes.length > 0 && !selectedSize) {
      return {error: "Please select size."};
    }
    if (!qty || qty === 0) {
      return {error: "Please select qty."};
    }
  }

  updateCartItemQuantity(data,tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    let url='/cart-backend/rest/V1/carts/mine/items'
    return this.http.put(url+data.cart_item.item_id,data,{headers:headers})
      // .map((response: Response) => response.json())
      // .catch(this.handleError);
  }

  removeCartItem(itemId,tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    let url='/cart-backend/rest/V1/carts/mine/items/'
    return this.http.delete(url+itemId, {headers:headers})
      // .map((response: Response) => response.json())
      // .catch(this.handleError);
  }

  shippingInformation(shippingData) {

    let tokenData=this.cookieService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData)
    let shippingInformation='/cart-backend/rest/V1/carts/mine/shipping-information';
    return this.http.post(shippingInformation,shippingData,{headers:headers})
      // .map((response: Response) => response.json())
      // .catch(this.handleError);
  }

  orderPlaced(data) {
    let tokenData=this.cookieService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData)
    let orderPlacedUrl='/cart-backend/rest/V1/carts/mine/payment-information'
    return this.http.post(orderPlacedUrl,data,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }
  paymentMethod(data) {
    let tokenData=this.cookieService.get("customerToken");
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData)
    let payTmUrl='/cart-backend/PaytmKit/pgRedirect.php'
    return this.http.post(payTmUrl,data,{headers:headers})
      // .map((response: Response) =>response.text())
      // .catch(this.handleError);
  }

  setCartItemCount(count) {
    return this.cartItemCount = count;
  }
  getCartItemCount() {
    return this.cartItemCount ;
  }

  setPaymentHtml(html) {
    return this.paymentData = html;
  }
  getPaymentHtml() {
    return this.paymentData ;
  }

  // private handleError(error: Response) {
  //   //console.error(error);
  //   return Observable.throw(error.json());
  // }

}

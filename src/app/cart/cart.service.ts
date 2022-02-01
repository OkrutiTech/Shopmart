import {Injectable} from "@angular/core";
import {HttpClient , HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService{
  constructor(private http:HttpClient) {
  }
  private cartItemCount;
  getCustomerCartDetail(tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    let url='/cart-backend/rest/V1/carts/mine';
    return this.http.get(url,{headers:headers})
  }
  setCartItemCount(count) {
    return this.cartItemCount = count;
  }
  getCartItemCount() {
    return this.cartItemCount ;
  }
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
    let url='/cart-backend/rest/V1/carts/mine/items'
    return this.http.delete(url+itemId, {headers:headers})
      // .map((response: Response) => response.json())
      // .catch(this.handleError);
  }

}

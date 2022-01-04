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
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
constructor(private http:HttpClient) {
}
  getProductMediaGallery(sku) {
    const headers = new HttpHeaders().set(
      'Content-Type', 'application/json')
      .set('Accept' , 'application/json');
    let url = '/cart-backend/rest/V1/products/'+sku+'?fields=media_gallery_entries';
    return this.http.get(url,{headers:headers})

  }
}

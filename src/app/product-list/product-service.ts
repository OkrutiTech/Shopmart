import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private currentProduct:any;
  constructor(private http: HttpClient) {
  }
  getProductDataById(id:string){
    let url=`/cart-backend/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}&fields=items[name,sku,price,attribute_set_id,custom_attributes]`
    return this.http.get(url)
  }
  getCategoryProductsAttributes(attrId:any) {
    let _attributesUrl = '/cart-backend/rest/V1/products/attribute-sets/' + attrId + '/attributes';

    return this.http.get(_attributesUrl);
  }

  getCategoryProductsPath(categoryId:any) {

    let _attributesUrl = '/cart-backend/rest/V1/categories/' + categoryId+'?fields=path,name';
    return this.http.get(_attributesUrl);
  }

  setCurrentProductData(data:any) {
    this.currentProduct = data;
  }

  getCurrentProductData() {
    return this.currentProduct;
  }
}


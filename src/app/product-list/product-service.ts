import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as _ from 'underscore';
import {Observable, of} from "rxjs";
import {HomeService} from '../home/home.service'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private currentProduct: any;
  currentFillterValue: any;
  mainsProducts: any = [];
  mainProduct: any = [];
  filters: any = [];
  currentFillterCode: any;
  categoryProducts: any=[];
  categoryAllProducts: any;
  private currentCategoryProducts: any;
  allProducts: any;
  products: any;
  categories:any
  path:any=[];
  currentCategoryName:any;
  currentCategoryId:any;
  loadProducts:string ='Loading products...' ;

  constructor(private http: HttpClient,private homeService: HomeService) {

  }

  getProductDataById(id: string) {
    let url = `/cart-backend/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}&fields=items[name,sku,price,attribute_set_id,custom_attributes]`
    return this.http.get(url)
  }

  getCategoryProductsAttributes(attrId: any) {
    let _attributesUrl = '/cart-backend/rest/V1/products/attribute-sets/' + attrId + '/attributes';

    return this.http.get(_attributesUrl);
  }

  getCategoryProductsPath(categoryId: any) {

    let _attributesUrl = '/cart-backend/rest/V1/categories/' + categoryId + '?fields=path,name';
    return this.http.get(_attributesUrl);
  }

  setCurrentProductData(data: any) {
    this.currentProduct = data;
  }

  setCategoryProducts(data: any) {
    this.currentCategoryProducts = data;
  }

  getCategoryProducts() {
    return this.currentCategoryProducts;
  }

  getCurrentProductData() {
    return this.currentProduct;
  }
  getcategoryProducts() {
    return this.categoryProducts;
  }

  populateFilterValue(filterValue: any) {
    if (this.currentFillterValue && !this.currentFillterValue.label) {
      this.categoryAllProducts = Object.assign([], this.categoryProducts);
    }
    this.currentFillterValue = filterValue;
    let filterItems: any = [];
    _.each(this.allProducts, (product: any) => {
      let defaultItem = "";
      _.each(product.items, (item: any) => {
        if (defaultItem) {
          return;
        }
        if (_.has(item, this.currentFillterCode) && item[this.currentFillterCode].indexOf(this.currentFillterValue.value) !== -1) {
          defaultItem = _.findWhere(product.items, {'sku': product.sku});
          if (defaultItem) {
            filterItems.push(defaultItem);
          } else {
            filterItems.push(item);
          }
        }
      });
    });
    this.categoryProducts = filterItems;
  }
  }


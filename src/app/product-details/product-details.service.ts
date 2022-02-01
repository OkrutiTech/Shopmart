import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ProductService} from "../product-list/product-service";
import * as _ from 'underscore';
import {ActivatedRoute, Router} from '@angular/router'
@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  currentCategoryId:any;
  allProducts:any;
  products:any;
  filters: any = [];
  categoryProducts: any = [];

constructor(private http:HttpClient,private productService :ProductService,private activateRouter:ActivatedRoute,private route:Router) {
}
  getProductMediaGallery(sku) {
    const headers = new HttpHeaders().set(
      'Content-Type', 'application/json')
      .set('Accept' , 'application/json');
    let url = '/cart-backend/rest/V1/products/'+sku+'?fields=media_gallery_entries';
    return this.http.get(url,{headers:headers})

  }
   mapProducts (id){
    this.currentCategoryId = id
     this.productService.getProductDataById(this.currentCategoryId).subscribe((products: any) => {
          // this.resetProducts();
          if (!products.items) {
            // this.loadPath = "";
            return;
          }
          _.each(products.items, function (item: any) {
            _.each(item.custom_attributes, function (attr: any) {
              let attribute: any = {};
              attribute[attr.attribute_code] = attr.value;
              _.extend(item, attribute);
            });
            delete item.custom_attributes;
          });
          products = _.chain(products.items)
            .map(function (item: any) {
              item.keyToGroup = item.sku.split("-")[0];
              let data = _.findWhere(products.items, {sku: item.keyToGroup});
              if (data) {
                return item;
              } else {
                item.keyToGroup = item.sku;
                return item;
              }
            })
            .groupBy('keyToGroup')
            .map((value: any, key: any) => {
              return {sku: key, items: value};
            })
            .value();
         this.allProducts = Object.assign([], products);
          this.products = this.allProducts;
          let keys: any = [];
          let attribute_setId = (products[0].items[0].attribute_set_id);
          _.each(this.products, (product: any) => {
            if (_.last(product.items).price === 0) {
              _.last(product.items).price = (product.items[0].price);
            }
            _.each(product.items, function (item: any) {
              keys = _.union(keys, _.keys(item));
            });
          });
        this.productService.getCategoryProductsAttributes(attribute_setId)
            .subscribe(
              (filtersAttributes: any) => {

                let matchedFilters = _.filter(filtersAttributes, (filtersAttribute: any) => {
                  return _.contains(["color", "size"], filtersAttribute.attribute_code) || filtersAttribute.frontend_input === "multiselect";
                });
                let filtersByAttributeId: any = [];
                let currentFilters: any = [];
                _.each(matchedFilters, (matchedFilter: any) => {
                  if (_.contains(keys, matchedFilter.attribute_code)) {
                    let currentFilter = {
                      'name': matchedFilter.attribute_code.split("_")[0],
                      'code': matchedFilter.attribute_code,
                      values: []
                    };
                    _.each(this.products, (product: any) => {
                      _.each(product.items, (item: any) => {
                        if (item[matchedFilter.attribute_code]) {
                          currentFilter.values = _.union(currentFilter.values, item[matchedFilter.attribute_code].split(','));
                        }
                      });
                    });
                    currentFilters.push(currentFilter);
                    matchedFilter.options = _.uniq(matchedFilter.options, (option: any) => {
                      return option;
                    });
                    matchedFilter.attribute_name = matchedFilter.attribute_code;
                    matchedFilter.attribute_code = matchedFilter.attribute_code.split("_")[0];
                    filtersByAttributeId.push(matchedFilter);
                  }
                });

                _.each(currentFilters, (fil: any) => {
                  let filter = {'name': fil.name, 'label': fil.name, 'code': fil.code, items: []};
                  let data = _.findWhere(filtersByAttributeId, {'attribute_code': fil.name}).options;
                  _.each(fil.values, (value: any) => {
                    let matchedData: any = _.findWhere(data, {'value': value});
                    matchedData.command = (event) => {
                      this.productService.populateFilterValue(event.item);
                    }
                    if (matchedData) {
                      // @ts-ignore
                      filter.items.push(matchedData);
                    }
                  });
                  this.filters.push(filter);
                });
                let colorValues = _.findWhere(this.filters, {'name': 'color'});
                if (colorValues) {
                  colorValues = colorValues.items;
                }
                let sizeValues = _.findWhere(this.filters, {'name': 'size'});
                if (sizeValues) {
                  sizeValues = sizeValues.items;
                }
                _.each(this.products, (product: any) => {
                  let colors: any = [];
                  let sizes: any = [];
                  _.each(product.items, (item: any) => {
                    if (item.color) {
                      let color = _.findWhere(colorValues, {'value': item.color});
                      if (color) {
                        colors.push(color);
                      }
                    }
                    if (item.size) {
                      let size = _.findWhere(sizeValues, {'value': item.size});
                      if (size) {
                        sizes.push(size);
                      }
                    }
                  });
                  let mainProduct = _.find(product.items, (item: any) => {
                    if (item.sku === product.sku) {
                      item.colors = _.uniq(colors);
                      item.sizes = _.uniq(sizes);
                      return item;
                    }

                  });
                  if (mainProduct) {

                    this.categoryProducts.push(mainProduct);


                  }
                });
                this.productService.setCategoryProducts(this.categoryProducts);
                console.log('products are here',this.categoryProducts);
                // console.log('current Data',this.categoryProducts)
                // this.urlSkuValue = this.activateRouter.snapshot.paramMap.get('sku');
                // this.currentProduct=_.find(this.categoryProducts,(product:any)=>{
                //   return product.sku===this.urlSkuValue;

                // });
                // console.log('current data item',this.currentProduct)

              },
              (error: any) => {
                this.products = [];
                this.filters = [];
                // this.loadPath = "";
                // this.toastr.error(error.message);
              }
            );
 return this.categoryProducts;
        },
        (error: any) => {
          this.products = [];
          // this.loadPath = "";
          // this.toastr.error(error.message);
        });
  }

}

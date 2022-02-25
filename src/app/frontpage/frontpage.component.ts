import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../product-list/product-service";
import {HomeService} from "../home/home.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit {
  // products: Product[];
  responsiveOptions;
  path: any = [];
  mapProduct: any;
  mainProduct: any = [];
  columns: number[];
  currentCategoryName: string;
  products: any;
  categoryProducts: any = [];
  product: { filter: '' };
  currentFillterCode: '';
  currentFillterValue: any;
  currentCategoryId: any;
  allProducts: any;
  categories: any;
  filters: any = [];
  categoryAllProducts: any = [];
  loadProducts: string = "Loading products...";
  mediaImage: string = "";
  selectedColor: any;
  selectedSize: any;
  error: string;
  currentProduct:string;
  currentCategoryProducts:any=[];
  constructor(private route: ActivatedRoute, private productService: ProductService, private homeService: HomeService, private primengConfig: PrimeNGConfig,private router: Router,private messageService:MessageService) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '150px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '150px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '150px',
        numVisible: 1,
        numScroll: 1
      }
    ];

      this.productService.getProductDataById("23").subscribe((products: any) => {
          this.resetProducts();
          if (!products.items) {
            this.messageService.add({severity:'success', summary:'Items', detail:'No items found in that category'});

            this.loadProducts = "";
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
                      this.populateFilterValue(event.item);
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
                    this.productService.setCategoryProducts(this.categoryProducts);
                  }


                });
              this.currentCategoryProducts=this.categoryProducts;
              console.log(this.currentCategoryProducts);
              },
              (error: any) => {
                this.products = [];
                this.filters = [];
                this.loadProducts = "";
                // this.toastr.error(error.message);
                this.messageService.add({severity:'error', summary:'Filters', detail:'CategoryProducts loaded Failed'});
              }
            );
        },
        (error: any) => {
          this.products = [];
          this.loadProducts = "";
          this.messageService.add({severity:'error', summary:'Filters', detail:'Product not Available'
          });
          // this.toastr.error(error.message);
        });




  }

  resetFilters() {
    this.currentFillterCode = "";
    this.currentFillterValue = {label: "", value: ""};
    this.categoryProducts = this.categoryAllProducts;
  }
  resetProducts() {
    this.products = [];
    this.categoryProducts = [];
    this.product = {filter: ''};
    this.currentFillterCode = '';
    this.currentFillterValue = {label: "", value: ""};
    this.allProducts = [];
    this.filters = [];
  }
  populateFilterName(event: any) {
    const currentFilter = _.find(this.filters, (f) => {
      return f.name === event.target.textContent;
    });
    if (currentFilter) {
      this.currentFillterCode = currentFilter.code;
    }

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
  getColor(color: any) {
    if (color) {
      return color;
    } else {
      return "";
    }
  }
  getMediaImage(product: any, color: any, productsColors: any) {
    this.mediaImage = "LoadingImage";
    let sku = product.sku;
    let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
    if (color.value) {
      this.selectedColor = color;

      // console.log(this.selectedColor,sku)
      let item = _.findWhere(skuProducts.items, {'color': this.selectedColor.value});
      if (item) {
        product.image = item.image;
      }
      _.each(productsColors, (color: any) => {
        if (color.value === this.selectedColor.value) {
          // @ts-ignore
          document.getElementById("colorBox_" + color.value + product.sku).className = "selected-color";
        } else {
          // @ts-ignore
          document.getElementById("colorBox_" + color.value + product.sku).className = "unselected-color";
        }

      });
    }
  }
  selectSize(product: any, size: any, productsSizes: any) {
    if (!product) {
      return;

    }
    if (!size) {
      return;
    }
    let sku = product.sku;
    this.currentProduct=sku
    let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
    if (size.value) {
      this.selectedSize = size;

      _.each(productsSizes, (size: any) => {
        if (size.value === this.selectedSize.value) {
          // @ts-ignore
          document.getElementById("sizeBox_" + size.value + product.sku).className = "selected-size";
        } else {
          // @ts-ignore
          document.getElementById("sizeBox_" + size.value + product.sku).className = "unselected-size";
        }

      });
    }
  }

  girlJacket(){
    this.router.navigateByUrl('category/:23/products');
  }
  girlTees(){
    this.router.navigateByUrl('category/:25/products');
  }
  menShirt(){
    this.router.navigateByUrl('category/:16/products');
  }
  menJacket(){
    this.router.navigateByUrl('category/:14/products');
  }
  yogaCollection(){
    this.router.navigateByUrl('category/:8/products');
  }
  saleNow(){
    this.router.navigateByUrl('category/:37/products');
  }
  ecoFriendlyProduct(){
    this.router.navigateByUrl('category/:36/products');
  }
  trendingProduct(){
    this.router.navigateByUrl('category/:23/products');
  }


}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import {ProductService} from './product-service'
import {HomeService} from '../home/home.service'
import * as _ from 'underscore';
import { PrimeNGConfig } from "primeng/api";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],

})
export class ProductListComponent implements OnInit {
  path:any=[];
  columns: number[];
  currentCategoryName:string;
  products: any;
  categoryProducts: any = [];
  product: { filter: '' };
  currentFillterCode: '';
  currentFillterValue: any;
  currentCategoryId: any;
  allProducts: any;
  categories:any;
  filters: any = [];
  categoryAllProducts: any = [];
  loadProducts: string = "Loading products...";
  mediaImage:string="";
  selectedColor:any;
  selectedSize:any;
  error:string;
  validateProduct:boolean;
  constructor(private route: ActivatedRoute,private productService:ProductService,private homeService:HomeService,private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.categories = this.homeService.getValue();
     this.route.params.subscribe((params:any) => {
      console.log(params) //log the entire params object
      this.currentCategoryId=params['id'];
      // console.log(this.id)
       this.productService.getProductDataById(this.currentCategoryId).subscribe( (products:any) => {
           this.resetProducts();
           if (!products.items) {
             // this.messageService.add({severity:'success', summary:'Items', detail:'No items found in that category'});

             // this.toastr.success("No items found in that category");
             this.loadProducts = "";
             return;
           }
           _.each(products.items, function (item:any) {
             _.each(item.custom_attributes, function (attr:any) {
               let attribute:any = {};
               attribute[attr.attribute_code] = attr.value;
               _.extend(item, attribute);
             });
             delete item.custom_attributes;
           });
           products = _.chain(products.items)
             .map(function (item:any) {
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
             .map( (value:any, key:any)=> {
               return {sku: key, items: value};
             })
             .value();
           this.allProducts = Object.assign([], products);
           this.products = this.allProducts;
           let keys:any = [];
           let attribute_setId = (products[0].items[0].attribute_set_id);
           _.each(this.products,  (product:any) =>{
             if (_.last(product.items).price === 0) {
               _.last(product.items).price = (product.items[0].price);
             }
             _.each(product.items, function (item:any) {
               keys = _.union(keys, _.keys(item));
             });
           });
           this.productService.getCategoryProductsAttributes(attribute_setId)
             .subscribe(
               (filtersAttributes:any) => {

                 let matchedFilters = _.filter(filtersAttributes,  (filtersAttribute:any)=> {
                   return _.contains(["color", "size"], filtersAttribute.attribute_code) || filtersAttribute.frontend_input === "multiselect";
                 });
                 let filtersByAttributeId :any= [];
                 let currentFilters :any= [];
                 _.each(matchedFilters,  (matchedFilter:any)=> {
                   if (_.contains(keys, matchedFilter.attribute_code)) {
                     let currentFilter = {
                       'name': matchedFilter.attribute_code.split("_")[0],
                       'code': matchedFilter.attribute_code,
                       values: []
                     };
                     _.each(this.products, (product:any) => {
                       _.each(product.items,  (item:any)=> {
                         if (item[matchedFilter.attribute_code]) {
                           currentFilter.values = _.union(currentFilter.values, item[matchedFilter.attribute_code].split(','));
                         }
                       });
                     });
                     currentFilters.push(currentFilter);
                     matchedFilter.options = _.uniq(matchedFilter.options,  (option:any) =>{
                       return option;
                     });
                     matchedFilter.attribute_name = matchedFilter.attribute_code;
                     matchedFilter.attribute_code = matchedFilter.attribute_code.split("_")[0];
                     filtersByAttributeId.push(matchedFilter);
                   }
                 });

                 _.each(currentFilters,  (fil:any)=> {
                   let filter = {'name': fil.name,'label': fil.name,  'code': fil.code, items: []};
                   let data = _.findWhere(filtersByAttributeId, {'attribute_code': fil.name}).options;
                   _.each(fil.values,  (value:any)=> {
                     let matchedData:any = _.findWhere(data, {'value': value});
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
                 _.each(this.products,  (product:any)=> {
                   let colors:any = [];
                   let sizes:any = [];
                   _.each(product.items,  (item:any)=> {
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
                   let mainProduct = _.find(product.items,  (item:any)=> {
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
                 this.allProducts = Object.assign([], this.products);
                 this.categories = this.homeService.getValue();
                 if (this.categories && this.categories.length > 0) {
                   this.path=[];
                   this.currentCategoryName="";
                   this.productService.getCategoryProductsPath(this.currentCategoryId).subscribe(
                     (data:any) => {
                       let pathValues = data.path.split("/");
                       this.path.push({label:'Home',url:"http://localhost:4200/home"});
                       this.currentCategoryName =  data.name;
                       let categoryChildren:any,subChildren:any;
                       _.each(pathValues,  (pathValue:any)=> {
                         if (pathValue === "1" || pathValue === "2") {
                           return;
                         }

                         let category = _.findWhere(this.categories, {'id': Number(pathValue)});
                         if (category) {
                           this.path.push({label:category.name,url:"http://localhost:4200/category/"+pathValue+"/products"});
                           if (category.children_data.length > 0) {
                             categoryChildren = category.children_data;
                           }
                         }else if(categoryChildren){
                           let SubCategory = _.findWhere(categoryChildren, {'id': Number(pathValue)});
                           if(SubCategory){
                             if (SubCategory.children_data.length > 0) {
                               subChildren = SubCategory.children_data;
                             }
                             this.path.push({label:SubCategory.name,url:"http://localhost:4200/category/"+pathValue+"/products"});
                           }
                           else if(subChildren){
                             let SubChildCategory = _.findWhere(subChildren, {'id': Number(pathValue)});
                             if(SubChildCategory){
                               this.path.push({label:SubChildCategory.name,url:"http://localhost:4200/category/"+pathValue+"/products"});
                             }
                           }
                         }
                       });
                       // this.messageService.add({severity:'success', summary:'Filters', detail:'Filter loaded successfully'});

                       // this.toastr.success("Filter loaded successfully");
                       // this.toastr.success("Category products loaded successfully");
                       // this.messageService.add({severity:'success', summary:'Products', detail:'Category products loaded successfully'});
                       this.loadProducts = "";
                       // let previousUrl = this._cookie.get('previousUrl');
                       // if (previousUrl.indexOf("product-sku") !== -1) {
                       //   let sku = previousUrl.split("product-sku/")[1];
                       //   let product = _.findWhere(this.categoryProducts, {'sku': sku});
                       //   if (product) {
                       //     this.populateDetailProduct(product);
                       //   }
                       // }

                       console.log(this.categoryProducts);
                       for(let i of this.categoryProducts){
                         console.log(i.image)
                       }
                       // console.log(this.filters);
                       // console.log(this.path);
                     },
                     (error:any) => {

                     }
                   );
                 }


               },
               (error:any) => {
                 this.products = [];
                 this.filters = [];
                 this.loadProducts = "";
                 // this.toastr.error(error.message);
               }
             );
           //this._router.navigate(['Home']);

         },
         (error:any) => {
           this.products = [];
           this.loadProducts = "";
           // this.toastr.error(error.message);
         });
    });

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

  populateDetailProduct(product:any) {
    let skuProducts=_.findWhere(this.allProducts, {'sku': product.sku});

    let currentProduct = {skuProducts:skuProducts, product: product, filters: this.filters};
    this.productService.setCurrentProductData(currentProduct);
    // this.router.navigate([`category-id/${this.currentCategoryId}/product-sku/${product.sku}`]);

  }

  populateFilterName(filterName:any) {
    this.currentFillterCode = filterName;
  }

  populateFilterValue(filterValue:any) {
    if (this.currentFillterValue && !this.currentFillterValue.label) {
      this.categoryAllProducts = Object.assign([], this.categoryProducts);
    }
    this.currentFillterValue = filterValue;
    let filterItems:any = [];
    _.each(this.allProducts,  (product:any)=> {
      let defaultItem = "";
      _.each(product.items,  (item:any)=> {
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

  getColor(color:any) {
    if (color) {
      return color;
    } else {
      return "";
    }
  }

  getMediaImage(product:any, color:any, productsColors:any) {
    this.mediaImage = "LoadingImage";
    let sku = product.sku;
    let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
    if (color.value) {
      this.selectedColor = color;
      let item = _.findWhere(skuProducts.items, {'color': this.selectedColor.value});
      if (item) {
        product.image = item.image;
      }
      _.each(productsColors,  (color:any)=> {
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

  selectSize(product:any, size:any, productsSizes:any) {
    if(!product){
      return;
    }
    if(!size){
      return;
    }
    let sku = product.sku;
    let skuProducts = _.findWhere(this.allProducts, {'sku': sku});
    if (size.value) {
      this.selectedSize = size;
      _.each(productsSizes,  (size:any)=> {
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

}

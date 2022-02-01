import { Component,OnInit } from '@angular/core';
import {ProductDetailsService} from "./product-details.service";
import {ProductService} from "../product-list/product-service";
import {ActivatedRoute, Router} from '@angular/router'
import {CookieService} from "ngx-cookie-service";
import {CartService} from "../cart/cart.service";
import {HomeService} from "../home/home.service";
import {MenuItem} from 'primeng/api';
import * as _ from 'underscore';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  currentCategoryId:any;
  currentCategoryName:any;
  mapProduct:any=[];
  mainProduct:any=[];
  currentFillterValue: any;
  categoryProduct:any;
  products: any;
  categoryProducts: any = [];
  product: { filter: '' };
  currentFillterCode: '';
  allProducts: any;
  filters: any = [];
  val: number = 4;
  id:any;
  urlSkuValue:any;
  currentSkuProducts: any;
  currentCategoryProducts:any;
  path: any = [];
  loadPath:string='';
  currentProducts:any;
  loadingBradecrumb:boolean=false;
  currentProduct: any;
  currentFilters: any;
  categories: any;
  images: any = [];
  moreInformations: any = [];
  selectedColor:any;
  selectedSize:any;
  error:string;
  items:MenuItem[];
  num='0';
  constructor(private productDetailService:ProductDetailsService,private productService:ProductService,private router:Router ,private cookieService:CookieService,private cartService:CartService , private activateRouter:ActivatedRoute,private homeService:HomeService) { }

  ngOnInit(): void {
    this.loadPath="Loading Product Detail"
    this.currentCategoryProducts=this.productService.getCategoryProducts();
    this.id = this.activateRouter.snapshot.paramMap.get('id');
    if (!this.currentCategoryProducts){

      this.categoryProduct= this.productDetailService.mapProducts(this.id);
       this.categoryProduct.then(data=>{
         this.currentCategoryProducts=data;
       })

      console.log('details data',this.currentCategoryProducts);
    }
    this.urlSkuValue = this.activateRouter.snapshot.paramMap.get('sku');

    this.currentProducts=_.find(this.currentCategoryProducts,(product:any)=>{
      return product.sku===this.urlSkuValue;
    });
    this.currentProduct=this.currentProducts;

    this.categories = this.homeService.getValue();
     // this.currentProducts = this.productService.getCurrentProductData();

    let categoryId = '';
    if (this.categories.length === 0 && !this.currentProducts) {
      this.activateRouter.params.subscribe(routeParams => {
        console.log(routeParams);
        categoryId = routeParams.id;
        this.cookieService.set('previousUrl', this.router.url);
        this.router.navigateByUrl(`category-id/${categoryId}/products`);
        return;
      });

    }


    if (this.currentProduct) {
      this.activateRouter.params.subscribe(routeParams => {
        categoryId = routeParams.id;

        // this.currentProduct = this.currentProducts.product;
        if (this.categories && this.categories.length > 0) {
          this.path = [];
          // this.currentCategoryName = "";
          this.productService.getCategoryProductsPath(categoryId).subscribe(
            (data: any) => {
              let pathValues = data.path.split("/");
              this.path.push({label: 'Home', url: "http://localhost:4200/home"});
              // this.currentCategoryName = data.name;
              let categoryChildren: any, subChildren: any;
              _.each(pathValues, (pathValue: any) => {
                if (pathValue === "1" || pathValue === "2") {
                  return;
                }

                let category = _.findWhere(this.categories, {'id': Number(pathValue)});
                if (category) {
                  this.path.push({
                    label: category.name,
                    url: "http://localhost:4200/category/" + pathValue + "/products"
                  });
                  if (category.children_data.length > 0) {
                    categoryChildren = category.children_data;
                  }
                } else if (categoryChildren) {
                  let SubCategory = _.findWhere(categoryChildren, {'id': Number(pathValue)});
                  if (SubCategory) {
                    if (SubCategory.children_data.length > 0) {
                      subChildren = SubCategory.children_data;

                    }
                    this.path.push({
                      label: SubCategory.name,
                      url: "http://localhost:4200/category/" + pathValue + "/products"
                    });
                  } else if (subChildren) {
                    let SubChildCategory = _.findWhere(subChildren, {'id': Number(pathValue)});
                    if (SubChildCategory) {
                      this.path.push({
                        label: SubChildCategory.name,
                        url: "http://localhost:4200/category/" + pathValue + "/products"
                      });
                    }
                  }
                }
              });
              this.path.push({label:this.currentProduct.name})
              this.loadingBradecrumb=true;
              // this.loadProducts = "";
              // console.log(this.filters);
              console.log(this.path);
            },
            (error: any) => {

            }
          );
        }
        this.currentSkuProducts = this.currentProducts.skuProducts;
        this.currentFilters = this.currentProducts.filters;
        this.getMediaGallery("");
        this.getMoreInformation();
      });
    }

  }

  getColor(color) {
    if (color) {
      return color;
      // this.loadPath='';
    } else {
      return "";
    }
  }

  setColor(selectedColor){
    let $this=this;
    $this.selectedColor = selectedColor;
    _.each(this.currentProduct.colors, function (color) {
      if (color.value === $this.selectedColor.value) {
        document.getElementById("colorBox_" + color.value + $this.currentProduct.sku).className = "selected-color";
      } else {
        document.getElementById("colorBox_" + color.value + $this.currentProduct.sku).className = "unselected-color";
      }

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
  getMediaGallery(color) {
    let sku = this.currentProduct.sku;
    if (color) {
      this.setColor(color);
      let item = _.findWhere(this.currentSkuProducts.items, {'color': color.value});
      if (item) {
        sku = item.sku;
      }
    }
    this.images = [];
    this.productDetailService.getProductMediaGallery(sku)
      .subscribe(
        (media:any) => {

          let mainItemIndex = 0;
          let mainItem;
          _.each(media.media_gallery_entries, function (media, index) {
            if (media.types && media.types.length > 0) {
              mainItem = media;
              mainItemIndex = index;
            }
          });
          if (mainItem) {
            media.media_gallery_entries.splice(0, 0, mainItem);
            media.media_gallery_entries.splice(mainItemIndex + 1, 1);
          }
          this.images = media.media_gallery_entries;
          this.loadPath='';
        },
        error => {

        });

  }

  getMoreInformation() {
    _.each(this.currentFilters,  (filter)=> {
      if (filter.code === "color" || filter.code === "size") {
        return;
      }
      let valueData;
      let fillValues;
      let information = {code: filter.code.toUpperCase(), value: ""};
      if (this.currentProduct[filter.code].indexOf(',') > -1) {
        fillValues = this.currentProduct[filter.code].split(',');
        _.each(fillValues, function (val) {
          valueData = _.findWhere(filter.items, {'value': val});
          if (valueData) {
            information.value = information.value == "" ? valueData.label : information.value + ',' + valueData.label;
          }
        });
      } else {
        fillValues = this.currentProduct[filter.code];
        valueData = _.findWhere(filter.items, {'value': fillValues});
        if (valueData) {
          information.value = valueData.label;
        }
      }
      if (information.value) {
        this.moreInformations.push(information);
        // this.loadPath='';
      }
    });

  }

  selectSize(size) {
    let $this=this;
    let sku = this.currentProduct.sku;
    if (size.value) {
      $this.selectedSize = size;
      _.each(this.currentProduct.sizes, function (size) {
        if (size.value === $this.selectedSize.value) {
          document.getElementById("sizeBox_" + size.value + $this.currentProduct.sku).className = "selected-size";
        } else {
          document.getElementById("sizeBox_" + size.value + $this.currentProduct.sku).className = "unselected-size";
        }

      });
    }
  }

  changeImage(imageIndex){
    this.num=imageIndex;
  }
}

import { Component,OnInit } from '@angular/core';

// import {Component, OnInit,ViewChild,Inject} from '@angular/core';
import {ProductDetailsService} from "./product-details.service";
import {ProductService} from "../product-list/product-service";
// import {ToastrService} from 'ngx-toastr';
// import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router'
// import {CategoryService} from '../../shared/category/category.service';
import {CookieService} from "ngx-cookie-service";
import {CartService} from "../cart/cart.service";
import {HomeService} from "../home/home.service";
// import {MatDialog} from '@angular/material';
// import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import {FormsModule, NgForm}  from '@angular/forms';
import {MenuItem} from 'primeng/api';


import * as _ from 'underscore';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  currentSkuProducts: any;
  currentProduct: any;
  currentFilters: any;
  categories: any;
  images: any = [];
  moreInformations: any = [];
  selectedColor:any;
  selectedSize:any;
  error:string;
  addCart={qty:""};
  items:MenuItem[];
  validateProduct:boolean;
  // productDetailForm: NgForm;
  constructor(private productDetailService:ProductDetailsService,private productService:ProductService,private router:Router ,private cookieService:CookieService,private cartService:CartService , private activateRouter:ActivatedRoute,private homeService:HomeService) { }

  ngOnInit(): void {
    this.categories = this.homeService.getValue();
    let currentProducts = this.productService.getCurrentProductData();
    console.log(currentProducts)
    if (this.categories.length === 0 && !currentProducts) {
      this.activateRouter.params.subscribe(routeParams => {
        console.log(routeParams);
        let categoryId = routeParams.currentCategoryId;
        this.cookieService.set('previousUrl', this.router.url);
        this.router.navigateByUrl(`category-id/${categoryId}/products`);
        return;
      });
    }
    if (currentProducts) {
      this.currentProduct = currentProducts.product;
      console.log(this.currentProduct)
      this.currentSkuProducts = currentProducts.skuProducts;
      this.currentFilters = currentProducts.filters;
      this.getMediaGallery("");
      this.getMoreInformation();
    }
  }

  getColor(color) {
    if (color) {
      return color;
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
        },
        error => {

        });
  }

  getMoreInformation() {
    let $this = this;
    _.each($this.currentFilters, function (filter) {
      if (filter.code === "color" || filter.code === "size") {
        return;
      }
      let valueData;
      let fillValues;
      let information = {code: filter.code.toUpperCase(), value: ""};
      if ($this.currentProduct[filter.code].indexOf(',') > -1) {
        fillValues = $this.currentProduct[filter.code].split(',');
        _.each(fillValues, function (val) {
          valueData = _.findWhere(filter.filterValues, {'value': val});
          if (valueData) {
            information.value = information.value == "" ? valueData.label : information.value + ',' + valueData.label;
          }
        });
      } else {
        fillValues = $this.currentProduct[filter.code];
        valueData = _.findWhere(filter.filterValues, {'value': fillValues});
        if (valueData) {
          information.value = valueData.label;
        }
      }
      if (information.value) {
        $this.moreInformations.push(information);
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




}

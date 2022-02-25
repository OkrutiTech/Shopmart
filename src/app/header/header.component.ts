import { Component, OnInit,Input } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {HomeService} from '../home/home.service';
import {Router} from '@angular/router'
import {CookieService} from "ngx-cookie-service";
import {ProductListComponent} from '../product-list/product-list.component'
import {UserMessageService} from "../user-message.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showUser:any
username='';
count=0;
  userData:any
  constructor(private homeService: HomeService, private _router: Router, private cookieService: CookieService,private userMessageService:UserMessageService) {

  }

  items: MenuItem[];

  ngOnInit() {
    this.userMessageService.reciveUserMessage().subscribe(data=>{
      let token=this.cookieService.get('customerToken')
      if(token && data){
        let customer = this.cookieService.get('customerDetail');
        let customerDetail=JSON.parse(customer);
        if(customerDetail){
          console.log("c",customerDetail)
          this.username=customerDetail.firstname +" "+ customerDetail.lastname;
          this.userData={
            name:this.username,
            email:customerDetail.email
          }
        }

        let customerCartCount=this.cookieService.get('customerCartCount');
        console.log("count",customerCartCount)
        let cartCount=JSON.parse(customerCartCount);
        if(cartCount){
          this.count=cartCount.itemsCount;
        }
      }
    })


    this.homeService.getData().subscribe(
      (d: any) => {
        this.items = d.children_data.map((c: any) => {
          c.label = c.name;
          if (c.children_data.length > 0) {
            c.items = c.children_data.map((sub: any) => {
              sub.label = sub.name;
              if (sub.children_data.length > 0) {
                sub.items = sub.children_data.map((ssub: any) => {
                  ssub.label = ssub.name;
                  ssub.routerLink = `/category/${ssub.id}/products`;
                  return ssub;
                });
              } else {
                sub.routerLink = `/category/${sub.id}/products`;
              }
              return sub;
            });

          } else {
            c.routerLink = `/category/${c.id}/products`;
          }
          return c;
        });
        this.homeService.setValue(this.items);
      }
    )

  }

  ngOnChange():void{
    this.userMessageService.reciveUserMessage().subscribe(data=>{
      let token=this.cookieService.get('customerToken')
      if(token && data) {
        let customer = this.cookieService.get('customerDetail');
        let customerDetail = JSON.parse(customer);
        if (customerDetail) {
          this.username = customerDetail.firstname;
        }

        let customerCartCount = this.cookieService.get('customerCartCount');
        let cartCount = JSON.parse(customerCartCount);
        if (cartCount) {
          this.count = cartCount.itemsCount;
        }
      }
    })
}
  logout()
  {
    this.cookieService.deleteAll();
    this.username="";
    this.count=0;

    this._router.navigate(['/login']);
  }

  addNewUser() {
    this._router.navigate(['/ProductListComponent'])
  }
}

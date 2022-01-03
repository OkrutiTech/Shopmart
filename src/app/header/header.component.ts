import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {HomeService} from '../home/home.service';
import {Router} from '@angular/router'
import {ProductListComponent} from '../product-list/product-list.component'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private homeService:HomeService,private _router:Router) {

  }

  items: MenuItem[];

  ngOnInit() {

    this.homeService.getData().subscribe(
      (d:any)=> {
        this.items= d.children_data.map((c:any)=>{
           c.label=c.name;
           if(c.children_data.length>0){
             c.items=c.children_data.map((sub:any)=>{
               sub.label=sub.name;
               if(sub.children_data.length>0){
                 sub.items=sub.children_data.map((ssub:any)=>{
                   ssub.label=ssub.name;
                   ssub.routerLink= `/category/${ssub.id}/products`;
                   return ssub;
                 });
               }else{
                sub.routerLink= `/category/${sub.id}/products`;
               }
               return sub;
             });

           }else{
             c.routerLink= `/category/${c.id}/products`;
           }
           return c;
        });
        this.homeService.setValue(this.items);
      }
    )

  }
  addNewUser(){
    this._router.navigate(['/ProductListComponent'])
  }

}

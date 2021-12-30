import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {HomeService} from '../home/home.service'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // data:[] = []
  constructor(private homeService:HomeService) {

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
                   return ssub;
                 });
               }
               return sub;
             });

           }
           return c;
        });
        console.log(this.items)
      }
    )
    console.log(this.items)
    // this.items = [
    //   {
    //     label:'File',
    //
    //   },
    //   {
    //     label:'Edit',
    //
    //   },
    //   {
    //     label:'Users',
    //   },
    //   {
    //     label:'Events',
    //   },
    //   {
    //     label:'Quit',
    //   }
    // ];
  }

}

import {Component,OnInit} from "@angular/core";
import {HomeService} from "../home/home.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
// import {ToastModule} from "primeng/toast";

@Component({
providers:[MessageService]
})

export class CartComponent implements OnInit{
    categories:any;
    loadCategories:string="";
    userName:string=""

  constructor(private homeService: HomeService,private _router:Router,private messageService: MessageService) {}
  ngOnInit(): void {
  }
}

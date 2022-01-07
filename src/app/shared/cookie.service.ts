import {CookieService} from 'ngx-cookie-service';
import {Component, Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CookiesService{
  private cookie_name='';
  private all_cookies_name:any='';
  constructor(private cookieService:CookieService) {
  }

  setCookie()
  {
    this.cookieService.set('name','');
  }
  deleteCookie()
  {
    this.cookieService.delete('name');
  }
  deleteAll()
  {
    this.cookieService.deleteAll();
  }
ngOnInit():void{
    this.cookie_name= this.cookieService.get('name');
    this.all_cookies_name=this.cookieService.getAll();
}
}

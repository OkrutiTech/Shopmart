import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private cookieService:CookieService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // let customerToken:any=this.cookieService.get('customerToken')
    // if(customerToken){
      return next.handle(request);}
  // }
}

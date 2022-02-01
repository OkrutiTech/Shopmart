import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserMessageService {

  constructor() { }
  private behaviorSubject=new BehaviorSubject<boolean>(true);
  sendUserMessage(data:boolean){
    this.behaviorSubject.next(data)
  }
  reciveUserMessage():Observable<boolean>{
    return this.behaviorSubject.asObservable()
  }
}

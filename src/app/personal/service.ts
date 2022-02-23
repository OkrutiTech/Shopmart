import {Injectable} from "@angular/core";
import {HttpClient , HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService{
  private putCustomerUrl = '/cart-backend/rest/V1/customers/me';
  constructor(private http:HttpClient) {
  }

  PutAccountInformation(customerData,tokenData) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', tokenData);
    return this.http.put(this.putCustomerUrl,customerData,{headers:headers})
      // .map((response: Response) =>response.json())
      // .catch(this.handleError);
  }

}

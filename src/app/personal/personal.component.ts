import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {AccountInformation,AddressBook} from "./interface";
import {ProfileService} from "./service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  personalInformation: any;
  data:any
  submitted: boolean = false;
  customerToken:any
  testData:any
  accountInformation:AccountInformation= {
    email:'',
    firstName:'',
    lastName:'',
    disabled:true,
    setAccount:false,
    updatingAccount:false,
  };
  addressBook: AddressBook = {
    firstname: "",
    lastname: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postcode: "",
    telephone: "",
    disabled: false,
    setAddressBook:false,
    updatingAddressBook: false
  };
  constructor(
    private router:Router,
    private cookieService:CookieService,
    private profileService:ProfileService,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    let customerToken=this.cookieService.get('customerToken')
    this.customerToken=customerToken
    if(customerToken) {
      let customer = this.cookieService.get('customerDetail');
      this.personalInformation = JSON.parse(customer);
      console.log('customerDetails', this.personalInformation)
    }
  }

  updateAddress() {
    // if (this.addressBook.setAddressBook && this.addressBook.disabled) {
    //   this.addressBook.disabled = false;
    // }
    // else {
      this.addressBook.updatingAddressBook = true;
      if (!this.personalInformation.firstname || ! this.personalInformation.lastname || !this.personalInformation.telephone || !(this.personalInformation.addressLine1 || this.personalInformation.addressLine2) || !this.personalInformation.city || !this.personalInformation.region || !this.personalInformation.postcode) {
        this.personalInformation.updatingAddressBook = false;
        this.personalInformation.disabled = false;
        return;
      }
      else {
        let customerDetail = JSON.parse(this.cookieService.get('customerDetail'));
        let customerData = {
          "customer": {
            "email": customerDetail.email,
            "firstname": customerDetail.firstname,
            "lastname": customerDetail.lastname,
            "websiteId": 1,
            "addresses": [
              {
                "firstname": this.personalInformation.firstname,
                "lastname": this.personalInformation.lastname,
                "street": [
                  this.personalInformation.addressLine1,
                  this.personalInformation.addressLine2
                ],
                "city": this.personalInformation.city,
                "region": {
                  "region": this.personalInformation.region
                },
                "country_id": "IN",
                "postcode": this.personalInformation.postcode,
                "telephone": this.personalInformation.telephone
              },
              {
                "firstname": this.personalInformation.firstname,
                "lastname": this.personalInformation.lastname,
                "street": [
                  this.personalInformation.addressLine1,
                  this.personalInformation.addressLine2
                ],
                "city": this.personalInformation.city,
                "region": {
                  "region": this.personalInformation.region
                },
                "country_id": "IN",
                "postcode": this.personalInformation.postcode,
                "telephone": this.personalInformation.telephone
              }
            ]
          }
        };
        this.profileService.PutAccountInformation(customerData,this.customerToken)
          .subscribe(
            customer => {
              this.cookieService.set('customerDetail', JSON.stringify(customer));
              let customerDetail = this.cookieService.get('customerDetail');
              if (customerDetail) {
                let customer = JSON.parse(customerDetail);
                if (customer) {
                  let userName = customer.firstname + " " + customer.lastname;
                  // this.cookieService.setUserName(userName);
                }
              }
              this.messageService.add({severity:'success', summary:'Address Book', detail:'Updated Address Book Successfully'});

              // this.toastr.success("Updated Address Book Successfully");
              this.addressBook.updatingAddressBook = false;
              this.addressBook.disabled = true;
              console.log("c",customer)
            },
            error => {
              this.messageService.add({severity:'success', summary:'Address Book', detail:'Address Book not Updated'});
            }
          );
      }
    // }
  }



  nextPage() {
    if (this.personalInformation.firstname && this.personalInformation.lastname && (this.personalInformation.addressLine1 || this.personalInformation.addressLine2) && this.personalInformation.city && this.personalInformation.telephone && this.personalInformation.region && this.personalInformation.postcode ) {
      // this.ticketService.ticketInformation.personalInformation = this.personalInformation;
      this.updateAddress()
      // this.router.navigateByUrl('checkout/payment');
      console.log("p",this.personalInformation)
      console.log("td",this.testData)
      // return;
    }

    this.submitted = true;
  }
}

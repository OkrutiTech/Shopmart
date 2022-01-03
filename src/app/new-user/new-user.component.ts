import { Component, OnInit } from '@angular/core';
import {NewUserService} from "./newuser.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  signUpFrom: FormGroup;
  submitted = false;
emailStatus:boolean=false;
formControlStatus:any;
  constructor(private formBuilder: FormBuilder,private newUserService:NewUserService) {}

  ngOnInit(): void {
    this.signUpFrom = this.formBuilder.group(
      {
        firstname: ['',[ Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)]],
        lastname: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email
        ,Validators.minLength(8),Validators.maxLength
          (30)
        ]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")
          ]
        ]
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signUpFrom.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    // let signUp={""}
    if (this.signUpFrom.invalid) {
      return;
    }
    console.log(JSON.stringify(this.signUpFrom.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.signUpFrom.reset();
  }
  validateEmail(){
    if(this.signUpFrom.controls.email.valid){
      let emailData = {"customerEmail": this.signUpFrom.controls.email.value};
      this.newUserService.validateEmail(emailData).subscribe(
        (data:any)=> {
         this.emailStatus=data;
         console.log(this.emailStatus)
        }
      )
    }
  }
}





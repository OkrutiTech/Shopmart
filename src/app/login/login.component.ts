import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
}from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  submitted = false;
  constructor(private router: Router,private formBuilder:FormBuilder) { }


  ngOnInit(): void {
    this.logInForm = this.formBuilder.group(
      {
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
    return this.logInForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    // let signUp={""}
    if (this.logInForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.logInForm.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.logInForm.reset();
  }
  navigateToSignUp(){
    this.router.navigateByUrl('/new-user');
  }
}

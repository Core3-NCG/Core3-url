import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  isUserCredentialsValid:boolean = true;
  constructor(private router:Router,private fb:FormBuilder) {
    this.loginForm = this.fb.group({
      userName:['',Validators.required,Validators.email],
      password:['',Validators.required],
    });
   }

  ngOnInit(): void {
    console.log(this.isUserCredentialsValid)
    this.loginForm.valueChanges.subscribe(() => {
      console.log("hi"+this.loginForm.valid +this.loginForm.touched);
      this.isUserCredentialsValid=this.loginForm.valid && this.loginForm.touched;
    })
  }

  onSubmit(){
    this.router.navigate(['/Home']);
  }

}

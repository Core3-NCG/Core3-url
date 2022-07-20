import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sleep } from '@cds/core/internal';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  isUserCredentialsValid:boolean = true;
  constructor(private router:Router,private fb:FormBuilder,private service:AuthServiceService) {
    this.loginForm = this.fb.group({
      userName:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
    });
   }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.isUserCredentialsValid=this.loginForm.valid && this.loginForm.touched;
    })
  }


  async onSubmit(){
    /**
     * waiting to get to the result of the async http request
     */
    let result = await this.service.login(this.loginForm.value);

    if(result == "Login Successful")
    {
      localStorage.setItem("userName",this.loginForm.get("userName")?.value);
      this.router.navigate(['/Home']);
    }
    else
      this.loginForm.setErrors({"incorrect":true});
  }

}

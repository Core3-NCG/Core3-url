import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AuthService
  ) {
    this.loginForm = this._formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    /**
     * waiting to get to the result of the async http request
     */
    this.isLoading = true;
    let result = await this._authService.login(this.loginForm.value);
    result=200
    if (result == 200) {
      localStorage.setItem('userName', this.loginForm.get('userName')?.value);
      this._router.navigate(['/home']);
      this.loginForm.setErrors(null);
    } else {
      this.loginForm.setErrors({ incorrect: true });
    }
    this.isLoading = false;
  }
}

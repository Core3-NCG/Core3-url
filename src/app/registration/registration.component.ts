import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  userExistsError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        userName: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator()]],
        confirmpassword: ['', Validators.required],
      },
      { validators: [this.checkConfirmationPassword()] }
    );
  }

  ngOnInit(): void {}

  async onSubmit() {
    /**
     * waiting to get to the result of the async http request
     */
    let result = await this.service.register({
      userName: this.registerForm.get('userName')?.value,
      password: this.registerForm.get('password')?.value,
    });
    if(result == 200)
    {
      localStorage.setItem("userName",this.registerForm.get("userName")?.value);
      this.router.navigate(['/home']);
    }
    else if (result == 409)
    {
      this.userExistsError = true;
    }
    else
      this.registerForm.setErrors({"incorrect":true});
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control?.value;
      let countLowerCase = 0,
        countUpperCase = 0,
        countDigits = 0,
        countSpecial = 0;
      for (let char of password) {
        if (char >= 'A' && char <= 'Z') {
          countUpperCase++;
        } else if (char >= 'a' && char <= 'z') {
          countLowerCase++;
        } else if (char >= '0' && char <= '9') {
          countDigits++;
        } else {
          countSpecial++;
        }
      }

      if (
        password.length > 6 &&
        countUpperCase >= 1 &&
        countLowerCase >= 1 &&
        countSpecial >= 1 &&
        countDigits >= 1
      )
        return null;
      else return { validation: 'please provide strong password' };
    };
  }

  checkConfirmationPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const form = group as FormGroup;
      const password = form.get('password')?.value;
      const confirmpassword = form.get('confirmpassword')?.value;
      if (password === confirmpassword) return null;
      else return { validation: 'Invalid passwords' };
    };
  }
}

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let _authService: AuthService;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[RouterTestingModule,ReactiveFormsModule,HttpClientTestingModule],
      providers:[AuthService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    _authService = TestBed.get(AuthService);
    _router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if login succesfull routes to home page', async () => {
    let ans:any = 200;
    let navResult:any = true;
    spyOn(_authService,"login").and.returnValue(ans);
    spyOn(_router,"navigate").and.returnValue(navResult);
    await component.onSubmit();
    expect(_router.navigate).toHaveBeenCalled();
  })

  it('should check for errors in form when login fails', async () => {
    let ans:any = 401;
    spyOn(_authService,"login").and.returnValue(ans);
    await component.onSubmit();
    expect(component.loginForm.errors).toEqual({ incorrect: true });
  })

});

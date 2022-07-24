import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';

import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let _authService: AuthService;
  let _router:Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationComponent ],
      imports:[ReactiveFormsModule,RouterTestingModule,HttpClientTestingModule,FormsModule],
      providers:[AuthService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    _authService = TestBed.get(AuthService);
    _router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check form is invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should check confirm password equals password', () => {
    component.registerForm.controls['userName'].setValue("name1@gmail.com");
    component.registerForm.controls['password'].setValue("Testing@123");
    component.registerForm.controls['confirmpassword'].setValue("Testin@123");
    expect(component.registerForm.get('confirmpassword')?.errors).toEqual({ validation: 'Invalid passwords' });
    component.registerForm.controls['confirmpassword'].setValue("Testing@123");
    expect(component.registerForm.get('confirmpassword')?.errors).toBeNull();
  })

  it('should check for a strong password', () => {
    component.registerForm.controls['userName'].setValue("name1@gmail.com");
    component.registerForm.controls['password'].setValue("Testing@123");
    expect(component.registerForm.get('password')?.invalid).toBeFalse();
    component.registerForm.controls['password'].setValue("Testing");
    expect(component.registerForm.get('password')?.invalid).toBeTrue();
  })


  it('should check if registeration successful routes to the home page', async () => {
    let result:any = 200;
    let navResult:any = true;
    spyOn(_authService,"register").and.returnValue(result);
    spyOn(_router,"navigate").and.returnValue(navResult);
    await component.onSubmit();
    expect(_router.navigate).toHaveBeenCalled();
  })

  it('should check if user already exists', async () => {
    let result:any = 409;
    spyOn(_authService,"register").and.returnValue(result);
    await component.onSubmit();
    expect(component.userExistsError.valueOf()).toBeTrue();
  })

});

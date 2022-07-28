import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let _router: Router;
  let _httpClient: HttpClientTestingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    _router = TestBed.get(Router);
    _httpClient = TestBed.get(HttpClientTestingModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should route to login page on logging out', () => {
    let navResult: any = true;
    spyOn(_router, 'navigate').and.returnValue(navResult);
    service.logout();
    expect(_router.navigate).toHaveBeenCalled();
  });

  it('should return status of login', async () => {
    let result: any = 200;
    spyOn(service, 'executeHttpRequest').and.returnValue(result);
    expect(
      await service.login({
        userName: 'name1@gmail.com',
        password: 'Testing@123',
      })
    ).toEqual(result);
    expect(service.executeHttpRequest).toHaveBeenCalled();
  });

  it('should return status of register', async () => {
    let result: any = 200;
    spyOn(service, 'executeHttpRequest').and.returnValue(result);
    expect(
      await service.register({
        userName: 'name1@gmail.com',
        password: 'Testing@123',
      })
    ).toEqual(result);
    expect(service.executeHttpRequest).toHaveBeenCalled();
  });

  it('should check if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('username');
    expect(service.isUserLoggedIn()).toEqual(true);
  });

  it('should check if user not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isUserLoggedIn()).toEqual(false);
  });
});

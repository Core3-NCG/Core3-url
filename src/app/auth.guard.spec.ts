import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let _authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guard = TestBed.inject(AuthGuard);
    _authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should check if user logged in', () => {
    spyOn(_authService, 'isUserLoggedIn').and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
    expect(_authService.isUserLoggedIn).toHaveBeenCalled();
  });
});

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from './constants/constants';
interface User {
  userName: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _httpClient: HttpClient,private _router:Router) {}

  isUserLoggedIn(): boolean {
    return localStorage.getItem('username') !== null;
  }

  async login(user: User): Promise<string> {
    let state = await this.executeHttpRequest(user, 'login');
    return state;
  }

  async register(user: User): Promise<string> {
    let state = await this.executeHttpRequest(user, 'register');
    return state;
  }

  async executeHttpRequest(user: User, apiName: string) {
    let promiseToExecuteRequest = new Promise((resolve, reject) => {
      const res = this._httpClient
        .post(Constants.serverAddress + apiName, user, {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text',
        })
        .subscribe((result) => {
          /**
           * getting the result
           * from the subscription
           * and resolving the same
           */
          resolve(result);
        });
      /**
       * setting timeout to 1 second
       * indicating failure of request execution
       */
      setTimeout(() => {
        reject();
      }, 1000);
    });

    let state: string = '';

    await promiseToExecuteRequest
      .then((result) => {
        state = typeof result == 'string' ? result : 'Something went wrong';
      })
      .catch(() => {
        state = 'Something went wrong';
      });
    return state;
  }
  logout(){
    localStorage.removeItem('userName');
    this._router.navigate(['/login']);
  }
}

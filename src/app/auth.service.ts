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
    return localStorage.getItem('userName') !== null;
  }

  async login(user: User): Promise<number> {
    let state = await this.executeHttpRequest(user, 'login');
    return state;
  }

  async register(user: User): Promise<number> {
    let state = await this.executeHttpRequest(user, 'register');
    return state;
  }

  async executeHttpRequest(user: User, apiName: string) {
    let promiseToExecuteRequest = new Promise( (resolve, reject) => {

      const res =this._httpClient.post(Constants.serverAddress+apiName
        ,user
        ,{headers: {'Content-Type': 'application/json'}
        ,responseType: 'text',observe:'response'})
        .subscribe( res=> {
          resolve(res.status);
        },
        error => {
          reject(error["status"]);
        }
        ); 
    });

    let state:number=0;

    await promiseToExecuteRequest.then((result) =>{
      state = typeof result == 'number' ? result: 0 ;
    }).catch((result) =>{
      state =  result;
    });

    return state;

  
  }
  logout(){
    localStorage.removeItem('userName');
    localStorage.clear();
    this._router.navigate(['/login']);
  }
}

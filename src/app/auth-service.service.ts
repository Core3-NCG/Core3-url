import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sleep } from '@cds/core/internal';
import { catchError } from 'rxjs';

interface  User{
  userName:string;
  password:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private url = "http://127.0.0.1:5000/";
  constructor(private http:HttpClient) { }

  async login(user:User){
    let state =  await this.executeHttpRequest(user,"login");
    return state;
  }

  async register(user:User){
    let state =  await this.executeHttpRequest(user,"register");
    return state;
  }

  async executeHttpRequest(user:User,apiName:string){
    
    let promiseToExecuteRequest = new Promise( (resolve, reject) => {

      const res =this.http.post(this.url+apiName
        ,user
        ,{headers: {'Content-Type': 'application/json'}
        ,responseType: 'text'})
        .subscribe( (result)=> {
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
      setTimeout(function() {
        reject(); 
      }, 1000);
          
    });

    let state:string="";

    await promiseToExecuteRequest.then((result) =>{
      state = typeof result == 'string' ? result: "Something went wrong" ;
    }).catch(() =>{
      state = "Something went wrong" ;
    });

    return state;

  }
  
}

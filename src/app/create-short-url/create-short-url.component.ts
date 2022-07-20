import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-short-url',
  templateUrl: './create-short-url.component.html',
  styleUrls: ['./create-short-url.component.css']
})
export class CreateShortUrlComponent implements OnInit {
  urlForm:FormGroup;
  isFormValid:boolean = false;
  urlRegExp:string = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  long_url:string='';

  constructor(private fb:FormBuilder,private cp:ClipboardService, private httpClient:HttpClient) {
    this.urlForm= this.fb.group({
      originalUrl:['',[Validators.required,Validators.pattern(this.urlRegExp)]],
      expirationTimeType:['Default',Validators.required],
      expirationDate:['',Validators.required]
    });
   }

  ngOnInit(): void {
    this.urlForm.get('expirationTimeType')?.valueChanges.subscribe(() => this.onexpirationTimeTypeChanges());
  }

  onSubmit(){
    this.urlForm.get('originalUrl')?.invalid
    this.isFormValid = true;
    
    /**
     * Checking if this URL is in the local storage
     */
    if(localStorage.getItem(this.urlForm.get("originalUrl")?.value)){
      this.long_url =  localStorage.getItem(this.urlForm.get("originalUrl")?.value)!;
      return;
    }

    let link ="http://127.0.0.1:5000/shortenUrl?"+"user="+localStorage.getItem("userName")+"&url="+this.urlForm.get("originalUrl")?.value;
    this.getRequest(link);
  }


  async getRequest(link:string){
    let promiseToExecuteRequest = new Promise((resolve, reject) =>{
      const res =this.httpClient.get(link,{responseType: 'text'})
        .subscribe(result=> {
          /**
           * getting the result 
           * from the subscription 
           * and resolving the same
          */
          resolve(result)
        });

      /**
       * setting timeout to 3 second
       * indicating failure of request execution
       */
      setTimeout(function() {
        reject(); 
      }, 3000);
    });

    await promiseToExecuteRequest
      .then((result) =>{

        this.long_url=typeof result == 'string' ? result: "Something went wrong" ;
  
        /**
         * storing the shortened url in local storage
         */
        localStorage.setItem(this.urlForm.get("originalUrl")?.value,this.long_url);

      })
      .catch(() =>{
        this.long_url= "Something went wrong" ;
      });
  }


  redirect() {
   const url = this.urlForm.get('originalUrl')?.value;
    window.open(url,'_blank');
  }

  share(){
    //need to implement
  }

  onexpirationTimeTypeChanges(){
    const expirationTimeTypeSelected = this.urlForm.get('expirationTimeType')?.value;
    if(expirationTimeTypeSelected === 'Custom'){
      this.urlForm.get('expirationDate')?.setValidators(this.dateValidator());
    }
    else{
      this.urlForm.get('expirationDate')?.clearValidators();
    }
  }

  dateValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control?.value){
        return {"date":"please select valid date"};
      }
      const expirationDate = new Date(control?.value);
      const currentDate = new Date();
      const isInvalidDate = expirationDate<currentDate;
      return isInvalidDate?{"date":"please select valid date"}:null;
  }
}

}

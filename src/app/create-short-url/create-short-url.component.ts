import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-create-short-url',
  templateUrl: './create-short-url.component.html',
  styleUrls: ['./create-short-url.component.css']
})
export class CreateShortUrlComponent implements OnInit {
  urlForm:FormGroup;
  isFormValid:boolean = false;
  urlRegExp:string = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private fb:FormBuilder,private cp:ClipboardService) {
    this.urlForm= this.fb.group({
      originalUrl:['',[Validators.required,Validators.pattern(this.urlRegExp)]],
      expirationTimeType:['Default',Validators.required],
      expirationDate:['',Validators.required],
    });
   }

  ngOnInit(): void {
    this.urlForm.get('expirationTimeType')?.valueChanges.subscribe(() => this.onexpirationTimeTypeChanges());
  }

  onSubmit(){
    this.urlForm.get('originalUrl')?.invalid
    console.log(this.urlForm);
    this.isFormValid = true;
  }

  redirect(){
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

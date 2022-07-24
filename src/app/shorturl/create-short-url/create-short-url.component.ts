import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { HttpClient } from '@angular/common/http';
import { UrlService } from '../services/url.service';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-create-short-url',
  templateUrl: './create-short-url.component.html',
  styleUrls: ['./create-short-url.component.css'],
})
export class CreateShortUrlComponent implements OnInit {
  urlForm: FormGroup;
  isFormValid: boolean = false;
  isLoading: boolean = false;
  shortUrl: string = '';
  previous = {};
  constructor(
    private _formBuilder: FormBuilder,
    private _clipboardService: ClipboardService,
    private _httpClient: HttpClient,
    private _urlService: UrlService
  ) {
    this.urlForm = this._formBuilder.group({
      originalUrl: [
        '',
        [Validators.required, Validators.pattern(Constants.urlRegExp)],
      ],
      expirationTimeType: ['Default', Validators.required],
      expirationDate: [''],
    });
  }

  ngOnInit(): void {
    this.urlForm.get('expirationTimeType')?.valueChanges.subscribe(() => {
      this.onexpirationTimeTypeChanges();
    });
    this.urlForm.valueChanges.subscribe(() => {
      if (this.previous && this.previous !== this.urlForm.value) {
        this.isFormValid = false;
      }
    });
  }

  onSubmit() {
    this.previous = this.urlForm.value;
    this.isFormValid = false;
    this.isLoading = true;
    let localStorageUrlKey =
      this.urlForm.get('originalUrl')?.value +
      this.urlForm.get('expirationDate')?.value;
    if (localStorage.getItem(localStorageUrlKey)) {
      this.shortUrl = localStorage.getItem(localStorageUrlKey)!;
      this.isFormValid = true;
    } else {
      this._urlService
        .createShortUrl(
          this.urlForm.get('originalUrl')?.value,
          this.urlForm.get('expirationDate')?.value
        )
        .subscribe((url) => {
          this.shortUrl = url;
          this.shortUrl =
            this.shortUrl == '' ? 'Something went wrong' : this.shortUrl;
          if (this.shortUrl != 'Something went wrong') {
            localStorage.setItem(localStorageUrlKey, this.shortUrl);
          }
          this.isFormValid = true;
        });

      /**
       * This gets all the urls of the user.
       */
      this._urlService
        .getUrlsByUsername(localStorage.getItem('userName')!)
        .subscribe((urls) => {});
    }
    this.isLoading = false;
    //this.resetForm();
  }

  resetForm() {
    this.urlForm.reset({
      originalUrl: '',
      expirationTimeType: 'Default',
      expirationDate: '',
    });
  }

  redirect() {
    const url = this.shortUrl;
    window.open(url, '_blank');
  }

  onexpirationTimeTypeChanges() {
    const expirationTimeTypeSelected =
      this.urlForm.get('expirationTimeType')?.value;
    if (expirationTimeTypeSelected === 'Custom') {
      this.urlForm.get('expirationDate')?.setValidators(this.dateValidator());
    } else {
      this.urlForm.get('expirationDate')?.clearValidators();
    }
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) {
        return { date: 'please select valid date' };
      }
      const expirationDate = new Date(control?.value);
      const currentDate = new Date();
      const isInvalidDate = expirationDate < currentDate;
      return isInvalidDate ? { date: 'please select valid date' } : null;
    };
  }
}

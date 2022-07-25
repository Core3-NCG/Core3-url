import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { importType } from '@angular/compiler/src/output/output_ast';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { of } from 'rxjs';
import { Constants } from 'src/app/constants/constants';
import { UrlService } from '../services/url.service';

import { CreateShortUrlComponent } from './create-short-url.component';

describe('CreateShortUrlComponent', () => {
  let component: CreateShortUrlComponent;
  let fixture: ComponentFixture<CreateShortUrlComponent>;
  const mockUrlService = jasmine.createSpyObj(UrlService, [
    'createShortUrl',
    'getUrlsByUsername',
  ]);
  mockUrlService.createShortUrl.and.returnValue(of(''));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateShortUrlComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, ClipboardModule],
      providers: [{ provide: UrlService, useValue: mockUrlService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShortUrlComponent);
    component = fixture.componentInstance;
    component.urlForm = new FormGroup({
      originalUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.urlRegExp),
      ]),
      expirationTimeType: new FormControl('Default', [Validators.required]),
      expirationDate: new FormControl(''),
    });
    fixture.detectChanges();
  });

  beforeEach(() => {
    let localStore: { [x: string]: string } = {};
    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid ,if url is not provided', () => {
    const formData = {
      originalUrl: '',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData);
    expect(component.urlForm.valid).toBeFalsy();
  });

  it('form should be invalid ,if url is not valid', () => {
    const formData = {
      originalUrl: 'sdfghthgh',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData);
    expect(component.urlForm.valid).toBeFalsy();
  });

  it('form should be invalid when expired date is less than current date in custom expiration time type', () => {
    const formData = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Custom',
      expirationDate: '07/12/2022',
    };
    component.urlForm.setValue(formData);
    fixture.detectChanges();
    expect(component.urlForm.valid).toBeFalsy();
  });

  it('form should be valid when valid details are provided ', () => {
    const formData = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Custom',
      expirationDate: '08/26/2022',
    };
    component.urlForm.setValue(formData);
    expect(component.urlForm.valid).toBeTruthy();
    const formData1 = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData1);
    expect(component.urlForm.valid).toBeTruthy();
  });

  it('should get short Url from Api,if not present in localStorage', () => {
    const formData = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData);
    fixture.detectChanges();
    mockUrlService.createShortUrl.and.returnValue(of(''));
    expect(component.urlForm.valid).toBeTruthy();
    component.onSubmit();
    expect(mockUrlService.createShortUrl).toHaveBeenCalled();
  });

  it('should get short Url from localStorage,if present in localStorage', () => {
    const formData = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData);
    fixture.detectChanges();
    localStorage.setItem('https://clarity.design/documentation/grid', '');
    expect(component.urlForm.valid).toBeTruthy();
    component.onSubmit();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('short url is generated, when valid form values provided and submitted', () => {
    const formData = {
      originalUrl: 'https://clarity.design/documentation/grid',
      expirationTimeType: 'Default',
      expirationDate: '',
    };
    component.urlForm.setValue(formData);
    fixture.detectChanges();
    expect(component.urlForm.valid).toBeTruthy();
    component.onSubmit();
    expect(component.isFormValid).toBeTruthy();
  });

  it('on redirect,short url shoulld be opened in new page', () => {
    spyOn(window, 'open');
    component.redirect();
    expect(window.open).toHaveBeenCalled();
  });
});

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlService } from '../services/url.service';

import { CreateShortUrlComponent } from './create-short-url.component';

describe('CreateShortUrlComponent', () => {
  let component: CreateShortUrlComponent;
  let fixture: ComponentFixture<CreateShortUrlComponent>;
  let _urlService: UrlService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateShortUrlComponent],
      imports:[ReactiveFormsModule,HttpClientTestingModule,FormsModule],
      providers: [UrlService]

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShortUrlComponent);
    _urlService = TestBed.get(UrlService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check form is invalid when empty', () => {
    expect(component.urlForm.valid).toBeFalsy();
  });

  it('should check for a valid Url', () => {
    component.urlForm.controls['originalUrl'].setValue("https://www.youtube.com/watch?v=nQDgVjd6yyI");
    expect(component.urlForm.valid).toBeFalse();
    component.urlForm.controls['originalUrl'].setValue("https://www.geeksforgeeks.org/");
    expect(component.urlForm.valid).toBeTrue();
  });

  it('should pass validation for valid expiration date', () => {
    let result:any = null;
    component.urlForm.controls['expirationDate'].setValue("07/26/2022");
    component.urlForm.controls['originalUrl'].setValue("https://www.geeksforgeeks.org/");
    component.urlForm.controls['expirationTimeType'].setValue("Custom");
    spyOn(component,"dateValidator").and.returnValue(result);
    component.onexpirationTimeTypeChanges();
    expect(component.urlForm.get('expirationDate')?.validator).toBeNull();
    expect(component.dateValidator).toHaveBeenCalled();
  });


  it('should fail validation for invalid expiration date',() => {
    let result:any = null;
    component.urlForm.controls['originalUrl'].setValue("https://www.geeksforgeeks.org/");
    component.urlForm.controls['expirationDate'].setValue("07/23/2022");
    component.urlForm.controls['expirationTimeType'].setValue("Custom");
    result = { date: 'please select valid date' };
    spyOn(component,"dateValidator").and.returnValue(result);
    component.onexpirationTimeTypeChanges();
    expect(component.urlForm.get('expirationDate')?.validator).toEqual({ date: 'please select valid date' });
    expect(component.dateValidator).toHaveBeenCalled();
  });

});

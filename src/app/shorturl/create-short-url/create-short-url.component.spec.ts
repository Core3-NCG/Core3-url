import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateShortUrlComponent } from './create-short-url.component';

describe('CreateShortUrlComponent', () => {
  let component: CreateShortUrlComponent;
  let fixture: ComponentFixture<CreateShortUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateShortUrlComponent],
      imports:[ReactiveFormsModule,HttpClientTestingModule]

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShortUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

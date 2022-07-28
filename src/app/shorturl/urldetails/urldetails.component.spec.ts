import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardModule } from 'ngx-clipboard';

import { UrldetailsComponent } from './urldetails.component';

describe('UrldetailsComponent', () => {
  let component: UrldetailsComponent;
  let fixture: ComponentFixture<UrldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipboardModule],
      declarations: [UrldetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on redirect,short url should be opened in new page', () => {
    spyOn(window, 'open');
    component.redirect();
    expect(window.open).toHaveBeenCalled();
  });
});

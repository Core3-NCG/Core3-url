import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrldetailsComponent } from './urldetails.component';

describe('UrldetailsComponent', () => {
  let component: UrldetailsComponent;
  let fixture: ComponentFixture<UrldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrldetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

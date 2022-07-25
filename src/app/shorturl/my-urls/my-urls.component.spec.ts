import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UrlService } from '../services/url.service';

import { MyUrlsComponent } from './my-urls.component';
interface UrlDetails {
  shortUrl: string;
  longUrl: string;
  expirationTime: number;
}
let mockUrldetails = {
  'http://127.0.0.1:5000/ARDVKm': {
    daysLeft: 6,
    originalUrl:
      'https://stackoverflow.com/questions/56623458/could-not-find-the-implementation-for-builder-angular-devkit-build-angulardev',
  },
  'http://127.0.0.1:5000/IN3DKH': {
    daysLeft: 3,
    originalUrl: 'https://www.geeksforgeeks.org/',
  },
};

describe('MyUrlsComponent', () => {
  let component: MyUrlsComponent;
  let fixture: ComponentFixture<MyUrlsComponent>;
  const mockUrlService = jasmine.createSpyObj(UrlService, [
    'getUrlsByUsername',
  ]);
  mockUrlService.getUrlsByUsername.and.returnValue(of(mockUrldetails));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyUrlsComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: UrlService, useValue: mockUrlService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMyUrls Api on Intialization', () => {
    expect(mockUrlService.getUrlsByUsername).toHaveBeenCalled();
  });

  it('urlDetailsList should contains its values from getMyUrlsApi ', () => {
    let urlDetailsList: UrlDetails[] = [
      {
        shortUrl: 'http://127.0.0.1:5000/ARDVKm',
        longUrl:
          'https://stackoverflow.com/questions/56623458/could-not-find-the-implementation-for-builder-angular-devkit-build-angulardev',
        expirationTime: 6,
      },
      {
        shortUrl: 'http://127.0.0.1:5000/IN3DKH',
        longUrl: 'https://www.geeksforgeeks.org/',
        expirationTime: 3,
      },
    ];
    expect(component.urlDetailsList).toEqual(urlDetailsList);
  });
});

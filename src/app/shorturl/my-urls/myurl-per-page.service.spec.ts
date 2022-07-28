import { TestBed } from '@angular/core/testing';
import { UrlDetails } from './my-urls.component';

import { MyurlPerPageService } from './myurl-per-page.service';
const mock: UrlDetails[] = [
  {
    shortUrl: 'http://127.0.0.1:5000/ARDVKm',
    longUrl:
      'https://stackoverflow.com/questions/56623458/could…ation-for-builder-angular-devkit-build-angulardev',
    expirationTime: 6,
  },
  {
    shortUrl: 'http://127.0.0.1:5000/IN3DKHsd',
    longUrl: 'https://www.geeksforgeeks.org/',
    expirationTime: 3,
  },
  {
    shortUrl: 'http://127.0.0.1:5000/ARDVKmsd',
    longUrl:
      'https://stackoverflow.com/questions/56623458/could…ation-for-builder-angular-devkit-build-angulardev',
    expirationTime: 6,
  },
  {
    shortUrl: 'http://127.0.0.1:5000/IN3DKHsdf',
    longUrl: 'https://www.geeksforgeeks.org/',
    expirationTime: 3,
  },
  {
    shortUrl: 'http://127.0.0.1:5000/ARDVKmsdfg',
    longUrl:
      'https://stackoverflow.com/questions/56623458/could…ation-for-builder-angular-devkit-build-angulardev',
    expirationTime: 6,
  },
  {
    shortUrl: 'http://127.0.0.1:5000/ARDVKmsdfgdfg',
    longUrl:
      'https://stackoverflow.com/questions/56623458/could…ation-for-builder-angular-devkit-build-angulardev',
    expirationTime: 6,
  },
];
describe('MyurlPerPageService', () => {
  let service: MyurlPerPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyurlPerPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get urlDetailsList from API', () => {
    service.getUrlDetailsList(mock);
    expect(mock).toEqual(service.urlDetailsList);
  });
  it('should return urlDetails onNextPage click,and number of details in page is (0,3)', () => {
    service.getUrlDetailsList(mock);
    //intialize index of page is -1;
    service.onNext(3);
    //now index of page shoulld be 2 -> (0,1,2)
    expect(service.urlDetailsPerPage.index).toEqual(2);
  });
  it('should return urlDetails onPreviousPage click,and number of details in page is (0,3)', () => {
    service.getUrlDetailsList(mock);
    //intialize index of page is -1;
    service.onNext(3);
    //now index of page shoulld be 2 -> (0,1,2)
    service.onNext(3);
    //now index of page shoulld be 5 -> (3,4,5)
    service.onPrevious(3);
    //now index of page shoulld be 2 -> (0,1,2)
    expect(service.urlDetailsPerPage.index).toEqual(2);
  });
  it('should return true when we cannot move to previous page', () => {
    service.getUrlDetailsList(mock);
    //intialize index of page is -1;
    //now index of page should be 2 -> (0,1,2)
    service.onNext(3);
    expect(service.urlDetailsPerPage.isPrevious).toEqual(true);
  });

  it('should return true when we cannot move to next page', () => {
    service.getUrlDetailsList(mock);
    //intialize index of page is -1;
    //now index of page should be 2 -> (0,1,2)
    service.onNext(3);
    //now index of page shoulld be 5 -> (3,4,5)
    service.onNext(3);
    //we don't have any details ,so isnext is true
    expect(service.urlDetailsPerPage.isNext).toEqual(true);
  });

  it("should direct to the right page when input changes", () => {
    service.getUrlDetailsList(mock);
    service.getDetailsByNumber(2,3);
    expect(service.urlDetailsPerPage.index).toEqual(2);
  })

  it("should show first page on changing page size", () => {
    service.getUrlDetailsList(mock);
    service.onPageSizeChange();
    expect(service.urlDetailsPerPage.index).toEqual(-1);
  })

});

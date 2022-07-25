import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UrlService } from './url.service';

describe('UrlService', () => {
  let service: UrlService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UrlService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return shortUrl ', () => {
    spyOn(httpClient, 'get').and.returnValue(
      of('http://127.0.0.1:5000/IN3DKH')
    );
    service
      .createShortUrl('https://www.geeksforgeeks.org/', '')
      .subscribe((shortUrl) => {
        expect(shortUrl).toEqual('http://127.0.0.1:5000/IN3DKH');
      });
  });
  it('should return urlDetails', () => {
    spyOn(httpClient, 'get').and.returnValue(of(mockGetUrlDetails));
    service.getUrlsByUsername('sowmya@gmail.com').subscribe((urlDetails) => {
      expect(urlDetails).toEqual(mockGetUrlDetails);
    });
  });
});
const mockGetUrlDetails = {
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

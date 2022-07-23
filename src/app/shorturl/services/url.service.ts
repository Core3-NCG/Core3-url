import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry } from 'rxjs';
import { Constants } from 'src/app/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  isLoading: boolean | undefined;
  long_url: string | undefined;
  urlForm: any;

  constructor(private _httpClient: HttpClient) {}

  createShortUrl(longUrl: string,expirationDate: string): Observable<string> {
    const link =
      Constants.serverAddress +
      'shortenUrl?' +
      'user=' +
      localStorage.getItem('userName') +
      '&url=' +
      longUrl +
      '&expiryDate='+
      expirationDate;
    return this._httpClient.get(link,{responseType: 'text'}).pipe(
      retry(1),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }

  /**
   * The return type is json. 
   * Of the format:-
   * {
    "http://127.0.0.1:5000/ARDVKm": {
        "daysLeft": 6,
        "originalUrl": "https://stackoverflow.com/questions/56623458/could-not-find-the-implementation-for-builder-angular-devkit-build-angulardev"
    },
    "http://127.0.0.1:5000/IN3DKH": {
        "daysLeft": 3,
        "originalUrl": "https://www.geeksforgeeks.org/"
    }
   */
  getUrlsByUsername(username: string) {
    const link =
    Constants.serverAddress +
    'myUrls?' +
    'user=' +
    localStorage.getItem('userName');
    return this._httpClient.get(link,{responseType: 'json'}).pipe(
      retry(1),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }
}



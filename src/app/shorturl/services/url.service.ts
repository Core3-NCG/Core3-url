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

  createShortUrl(longUrl: string): Observable<string> {
    const link =
      Constants.serverAddress +
      'shortenUrl?' +
      'user=' +
      localStorage.getItem('userName') +
      '&url=' +
      longUrl;
    return this._httpClient.get<string>(link).pipe(
      retry(1),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }

  getUrlsByUsername(username: string) {}
}

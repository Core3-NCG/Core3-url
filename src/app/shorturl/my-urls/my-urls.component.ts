import { Component, OnInit } from '@angular/core';
import { UrlService } from '../services/url.service';
import { UrldetailsComponent } from '../urldetails/urldetails.component';

interface UrlDetails {
  shortUrl: string;
  longUrl: string;
  expirationTime: number;
}
@Component({
  selector: 'app-my-urls',
  templateUrl: './my-urls.component.html',
  styleUrls: ['./my-urls.component.css'],
})
export class MyUrlsComponent implements OnInit {
  urlDetailsList: UrlDetails[] = [];
  constructor(private _urlService: UrlService) {}
  ngOnInit(): void {
    this.urlDetailsList = [];
    const userName: string = localStorage.getItem('userName')!;
    this._urlService.getUrlsByUsername(userName).subscribe((details) => {
      Object.entries(details).map((entry) => {
        let key = entry[0];
        let value = entry[1];
        const urlDetails: UrlDetails = {
          shortUrl: key,
          longUrl: value.originalUrl,
          expirationTime: value.daysLeft,
        };
        this.urlDetailsList.push(urlDetails);
      });
    });
  }
}

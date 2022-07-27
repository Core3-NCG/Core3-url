import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { UrlService } from '../services/url.service';
import { UrldetailsComponent } from '../urldetails/urldetails.component';
import { MyurlPerPageService } from './myurl-per-page.service';

export interface UrlDetails {
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
  isPrevious = false;
  isNext = false;
  isLoading = false;
  urlDetailsPerPage:BehaviorSubject<UrlDetails[]> = new BehaviorSubject<UrlDetails[]>([]);
  index = -1;
  pageNumber:number=0;
  constructor(private _urlService: UrlService,private _myurlPerPageService:MyurlPerPageService) {}
  ngOnInit(): void {
    console.log("in my urls");
    this.urlDetailsList = [];
   // this._myurlPerPageService.ngOnInit();
    const userName: string = localStorage.getItem('userName')!;
    this.isLoading = true;
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
      console.log("url Details"+this.urlDetailsList.length)
    this._myurlPerPageService.getUrlDetailsList(this.urlDetailsList);
    this.nextPage();
    this.isLoading = false;
  });
  }
  nextPage(){
    this.isLoading = true;
    this._myurlPerPageService.onNext(3).subscribe(details =>{
      console.log(details);
      this.urlDetailsPerPage.next(details.urlDetailsList);
      this.isPrevious = details.isPrevious;
      this.isNext = details.isNext;
      this.pageNumber = Math.floor((details.index/3)+1);
      this.isLoading = false;
    });
  }
  previousPage(){
    this.isLoading = true;
    this._myurlPerPageService.onPrevious(3).subscribe(details =>{
      this.urlDetailsPerPage.next(details.urlDetailsList);
      this.isPrevious = details.isPrevious;
      this.isNext = details.isNext;
      this.pageNumber = Math.floor((details.index/3)+1);
      this.isLoading = false;
    });
  }
}

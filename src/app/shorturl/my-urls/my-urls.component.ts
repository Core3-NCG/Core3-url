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
  numberOfPages = 0;
  pageSizes = [3, 6, 9];
  currentPageSize = 3;
  urlDetailsPerPage: BehaviorSubject<UrlDetails[]> = new BehaviorSubject<
    UrlDetails[]
  >([]);
  index = -1;
  pageNumber: number = 0;
  constructor(
    private _urlService: UrlService,
    private _myurlPerPageService: MyurlPerPageService
  ) {}
  ngOnInit(): void {
    this.urlDetailsList = [];
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
      const size: number = +this.currentPageSize;
      this.numberOfPages = Math.round(this.urlDetailsList.length / size);
      this._myurlPerPageService.getUrlDetailsList(this.urlDetailsList);
      this.nextPage();
      this.isLoading = false;
    });
  }
  nextPage() {
    this.isLoading = true;
    const size: number = +this.currentPageSize;
    this._myurlPerPageService.onNext(size).subscribe((details) => {
      this.urlDetailsPerPage.next(details.urlDetailsList);
      this.isPrevious = details.isPrevious;
      this.isNext = details.isNext;
      const size: number = +this.currentPageSize;
      this.pageNumber = Math.floor(details.index / size + 1);
      this.isLoading = false;
    });
  }
  previousPage() {
    this.isLoading = true;
    const size: number = +this.currentPageSize;
    this._myurlPerPageService.onPrevious(size).subscribe((details) => {
      this.urlDetailsPerPage.next(details.urlDetailsList);
      this.isPrevious = details.isPrevious;
      this.isNext = details.isNext;
      const size: number = +this.currentPageSize;
      this.pageNumber = Math.floor(details.index / size + 1);
    });
    this.isLoading = false;
  }
  onPageChange() {
    if (this.pageNumber > 0 && this.pageNumber <= this.numberOfPages) {
      const size: number = +this.currentPageSize;
      this._myurlPerPageService.getDetailsByNumber(this.pageNumber, size);
      this.nextPage();
    }
  }
  pageSizeChange() {
    const size: number = +this.currentPageSize;
    this._myurlPerPageService.onPageSizeChange();
    this.numberOfPages = Math.ceil(this.urlDetailsList.length / size);
    this.nextPage();
  }
}

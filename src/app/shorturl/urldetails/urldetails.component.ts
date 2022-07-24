import { Component, Input, OnInit } from '@angular/core';

interface UrlDetails{
  shortUrl:string;
  longUrl:string;
  expirationTime:number;
}

@Component({
  selector: 'app-urldetails',
  templateUrl: './urldetails.component.html',
  styleUrls: ['./urldetails.component.css']
})
export class UrldetailsComponent implements OnInit {
  @Input() urlDetails:UrlDetails = {
    shortUrl: 'https://clarity.design/documentation/grid',
    longUrl: 'https://clarity.design/documentation/grid',
    expirationTime: 0
  }

  constructor() { }
  ngOnInit(): void {  }

  redirect() {
    const url = this.urlDetails.shortUrl;
    window.open(url, '_blank');
  }

}

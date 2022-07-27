import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Injectable, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { UrlService } from '../services/url.service';
import { UrlDetails } from './my-urls.component';
export interface UrlDetailsPerPage{
  isPrevious:boolean;
  isNext:boolean;
  urlDetailsList:UrlDetails[];
  index:number;
}
@Injectable({
  providedIn: 'root'
})
export class MyurlPerPageService {

  constructor() { 
    console.log("ubndnf")
  }
  urlDetailsList:UrlDetails[]=[];
  urlDetailsPerPage!: UrlDetailsPerPage;
  getUrlDetailsList(details:UrlDetails[]){
    this.urlDetailsPerPage = {
      isPrevious:false,
      isNext:false,
      urlDetailsList:[],
      index:-1
    };
    this.urlDetailsList = details;
    console.log(this.urlDetailsList,this.urlDetailsPerPage);
  }
  isPrevious(){
    const currentIndex = this.urlDetailsPerPage.index;
    if(currentIndex>=0 && currentIndex<3){
      this.urlDetailsPerPage.isPrevious = true;
    }
    else{
      this.urlDetailsPerPage.isPrevious = false;
    }
  }
  isNext(){
    console.log("isNext urlDetails list",this.urlDetailsList);
    console.log("isNext urlDetails Page",this.urlDetailsPerPage);
    const currentIndex = this.urlDetailsPerPage.index;
    if(currentIndex === this.urlDetailsList.length -1){
      this.urlDetailsPerPage.isNext = true;
    }
    else{
      this.urlDetailsPerPage.isNext = false;
    }
  }
  onPrevious(size:number){
    let currentIndex = this.urlDetailsPerPage.index;
    console.log("HI"+currentIndex);
    const lastIndex:number = (Math.floor((currentIndex)/size)*size)-1;
    const startIndex:number =(lastIndex-size)+1;
    let urlDetailsListPerPage: UrlDetails[]=[];
    for(let i=startIndex;i<=lastIndex;i++){
      if(i>=this.urlDetailsList.length || i<0){
        break;
      }
      currentIndex = i;
      urlDetailsListPerPage.push(this.urlDetailsList[i]);
    }
    console.log("final"+currentIndex);
    this.urlDetailsPerPage.index = currentIndex;
    this.urlDetailsPerPage.urlDetailsList=urlDetailsListPerPage;
    this.isPrevious();
    this.isNext();
    return of(this.urlDetailsPerPage);
  }
  onNext(size:number){
    let currentIndex = this.urlDetailsPerPage.index;

    console.log("HI"+currentIndex);

    const lastIndex:number = currentIndex+size;
    const startIndex:number = currentIndex+1;
    let urlDetailsListPerPage: any[]=[];
    for(let i=startIndex;i<=lastIndex;i++){
      if(i>=this.urlDetailsList.length|| i<0){
        break;
      }
      currentIndex = i;
      urlDetailsListPerPage.push(this.urlDetailsList[i]);
    }
    console.log("final"+currentIndex);
    this.urlDetailsPerPage.index = currentIndex;
    this.urlDetailsPerPage.urlDetailsList=urlDetailsListPerPage;
    this.isPrevious();
    this.isNext();
    return of(this.urlDetailsPerPage);
  }
}

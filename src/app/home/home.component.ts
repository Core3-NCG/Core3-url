import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName:string = localStorage.getItem('userName')!;
  constructor(private _authService:AuthService) { }

  ngOnInit(): void {
  }

  logoutUser(){
    this._authService.logout();
  }
}

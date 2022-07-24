import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { CreateShortUrlComponent } from './shorturl/create-short-url/create-short-url.component';
import { MyUrlsComponent } from './shorturl/my-urls/my-urls.component';
import { UrldetailsComponent } from './shorturl/urldetails/urldetails.component';
import { UrlService } from './shorturl/services/url.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CreateShortUrlComponent,
    MyUrlsComponent,
    UrldetailsComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ClipboardModule,
    HttpClientModule,
  ],
  providers: [AuthService,AuthGuard,UrlService],
  bootstrap: [AppComponent],
})
export class AppModule {}

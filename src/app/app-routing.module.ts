import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateShortUrlComponent } from './create-short-url/create-short-url.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyUrlsComponent } from './my-urls/my-urls.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Register', component: RegistrationComponent },
  {
    path: 'Home', component: HomeComponent,
    children: [
      { path: 'CreateUrl', component: CreateShortUrlComponent }
      , { path: 'MyUrls', component: MyUrlsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

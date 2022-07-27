import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CreateShortUrlComponent } from './shorturl/create-short-url/create-short-url.component';
import { MyUrlsComponent } from './shorturl/my-urls/my-urls.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {path:'',component:CreateShortUrlComponent},
      { path: 'createurl', component: CreateShortUrlComponent },
      { path: 'myurls', component: MyUrlsComponent },
    ],
  },
  {
    path:'**',pathMatch: 'full',component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

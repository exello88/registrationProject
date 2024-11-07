import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VKAuth, OKAuth, getLinksForLogin } from 'src/app/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {


  constructor(private router: Router) { }


  public redirectToVkLogin(): void {
    window.open('https://api.vk.com/oauth/authorize?response_type=token&' +getLinksForLogin(VKAuth, 'vk'), '_self');
  }

  public redirectToOkLogin(): void {
    window.open('https://www.odnoklassniki.ru/oauth/authorize?response_type=code&' + getLinksForLogin(OKAuth, 'ok'), '_self');
  }
}

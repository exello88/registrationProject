import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VKAuth, OKAuth } from 'src/app/environments';

interface OAuth {
  appId: string,
  appSecret: string,
  redirectUri: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {


  public redirectToVkLogin(): void {
    window.open('https://api.vk.com/oauth/authorize?response_type=token&' + this.getLinksForLogin(VKAuth, 'vk'), '_self');
  }

  public redirectToOkLogin(): void {
    window.open('https://www.odnoklassniki.ru/oauth/authorize?response_type=code&' + this.getLinksForLogin(OKAuth, 'ok'), '_self');
  }

  private getLinksForLogin(source: OAuth, sourceName: string): string {
    return `client_id=${source.appId}&redirect_uri=${source.redirectUri + `?source=${sourceName}`}&scope=friends&v=5.199`;
};
}

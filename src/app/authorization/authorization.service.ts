import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { VKAuth, OKAuth } from 'src/app/environments';
import { user } from '../session-data';

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
    this.localStorageTokenclear('VkToken');
    window.open('https://api.vk.com/oauth/authorize?response_type=token&' + this.getLinksForLogin(VKAuth, 'vk'), '_self');
  }

  public redirectToOkLogin(): void {
    window.open('https://www.odnoklassniki.ru/oauth/authorize?response_type=code&' + this.getLinksForLogin(OKAuth, 'ok'), '_self');
  }

  private getLinksForLogin(source: OAuth, sourceName: string): string {
    return `client_id=${source.appId}&redirect_uri=${source.redirectUri + `?source=${sourceName}`}&scope=users,friends,groups&v=5.199`;
  };

  private localStorageTokenclear(key: string): void {
    if (localStorage.getItem(key) !== null) 
      localStorage.removeItem(key);

    user.userInfo = null;
    user.userActivities.followersCount = undefined;
    user.userActivities.friendsCount = undefined;
    user.userActivities.subscribeCount = undefined;
  }
}

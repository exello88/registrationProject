import { Injectable } from '@angular/core';
import { VKAuth, OKAuth } from 'src/app/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  public redirectToVkLogin(): void {
    window.location.href = `https://api.vk.com/oauth/authorize?response_type=token&client_id=${VKAuth.appId}&redirect_uri=${(VKAuth.redirectUri + '?source=vk')}&scope=friends&source=vk&v=5.199`;
  }

  public redirectToOkLogin(): void {
    window.location.href = `https://www.odnoklassniki.ru/oauth/authorize?response_type=code&client_id=${OKAuth.appId}&redirect_uri=${(OKAuth.redirectUri + '?source=ok')}&scope=friends&v=5.199`;
  }
}

import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public rememberMe: boolean = false;

  constructor(private authServise: AuthorizationService) {}

  public changeRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }

  public loginWithVK(): void {
    this.authServise.redirectToVkLogin();
  }

  public loginWithOK(): void {
    this.authServise.redirectToOkLogin();
  }
}

import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  public rememberMe: boolean = false;

  constructor(private authServise : AuthorizationService) {}

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



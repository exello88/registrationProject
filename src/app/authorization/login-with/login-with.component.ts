import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-login-with',
  templateUrl: './login-with.component.html',
  styleUrls: ['./login-with.component.scss']
})
export class LoginWithComponent {
  
  constructor(private authServise : AuthorizationService) {}

  public loginWithVK(): void {
    this.authServise.redirectToVkLogin();
  }

  public loginWithOK(): void {
    this.authServise.redirectToOkLogin();
  }
}
